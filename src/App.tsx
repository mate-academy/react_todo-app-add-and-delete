/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deletePost, getTodos, USER_ID } from './api/todos';
import { Button } from './components/Button/Button';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { filterQuery, TIMEOUT_CLEAR } from './constants/constants';
import { Link } from './components/Link/Link';
import classNames from 'classnames';

type Staus = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusTodo, setStatusTodo] = useState<Staus>('All');
  const [deletedId, setDdeletedId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [titleTodo, setTitleTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const refInputAdd = useRef<HTMLInputElement | null>(null);

  const loadingTodos = () => {
    setErrorMessage('');
    // setIsLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(new Error('Unable to load todos').message);
      });
    // .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadingTodos();
    refInputAdd.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => setErrorMessage(''), TIMEOUT_CLEAR);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (tempTodo === null) {
      refInputAdd.current?.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const setFilter = (filter: Staus) => setStatusTodo(filter);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(prevTodos => [...prevTodos, todoFromServer]);
        setTitleTodo('');
      })
      .catch(() => setErrorMessage(new Error('Unable to add a todo').message))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setDdeletedId(prevIds => [...prevIds, id]);
    // deletePost(id)
    //   .then(() => {
    //     setTodos(prevTodos => [...prevTodos].filter(tod => tod.id !== id));

    //     return id;
    //   })
    //   .catch(() =>
    //     setErrorMessage(new Error('Unable to delete a todo').message),
    //   )
    //   .finally(() => setDdeletedId([]));

    // refInputAdd.current?.focus();
    return deletePost(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(tod => tod.id !== id));

        return id;
      })
      .catch(() => {
        setErrorMessage(new Error('Unable to delete a todo').message);
        throw new Error(`Unable to delete todo with id ${id}`);
      })
      .finally(() => {
        setDdeletedId([]);
        refInputAdd.current?.focus();
      });
  };

  const prepareTodos = (): Todo[] => {
    switch (statusTodo) {
      case 'Active':
        return todos.filter(todoItem => !todoItem.completed);
      case 'Completed':
        return todos.filter(todoItem => todoItem.completed);
      default:
        return todos;
    }
  };

  const deleteCompleted = () => {
    setDdeletedId(
      todos.reduce((acc: number[], todo) => {
        if (todo.completed) {
          const result = [...acc];

          result.push(todo.id);

          return result;
        } else {
          return acc;
        }
      }, []),
    );

    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => handleDelete(todo.id));

    Promise.allSettled(deletePromises)
      .then(data => {
        if (!data.some(todo => todo.status === 'fulfilled')) {
          throw new Error('Unable to delete a todo');
        }
      })
      .catch(error => setErrorMessage(error.message));

    // Promise.allSettled(deletePromises)
    //   .then(() => {
    //     setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    //   })
    //   .catch(() =>
    //     setErrorMessage(new Error('Unable to delete a todo').message),
    //   )
    //   .finally(() => setDdeletedId([]));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <Button
            type="button"
            className="todoapp__toggle-all
            active"
            dataCy="ToggleAllButton"
          />
          {/* Add a todo on form submit */}
          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => setTitleTodo(e.target.value)}
              value={titleTodo}
              ref={refInputAdd}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {prepareTodos().map(todo => (
            <TodoItem
              key={todo.id}
              title={todo.title}
              completed={todo.completed}
              isLoading={false}
              deletedId={deletedId}
              id={todo.id}
              handleDelete={() => handleDelete(todo.id)}
            />
          ))}
          {!!tempTodo && (
            <TodoItem
              title={tempTodo.title}
              completed={tempTodo.completed}
              isLoading={true}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todoItem => !todoItem.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {filterQuery.map(query => (
                <Link
                  key={query}
                  href={`#/${query === 'All' ? '' : query.toLowerCase()}`}
                  className="filter__link"
                  dataCy={`FilterLink${query}`}
                  onClick={() => setFilter(query)}
                  content={query}
                  status={statusTodo}
                />
              ))}
            </nav>

            {/* this button should be disabled if there are no completed todos */}

            <button
              onClick={deleteCompleted}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
