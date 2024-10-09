/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as f from '../src/api/todos';
import { TodoList } from './components/TodoList';
import { NewTodo, Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './Enum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('All');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorText, setErrorText] = useState('');
  const [addTodoInput, setAddTodoInput] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    f.getTodos()
      .then(setTodos)
      .catch(error => {
        console.error(error);
        setErrorText('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    switch (filterBy) {
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;

      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;

      default:
        setFilteredTodos(todos);
        break;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [filterBy, todos]);

  useEffect(() => {
    if (errorText) {
      const timer = setTimeout(() => {
        setErrorText('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorText]);

  if (!f.USER_ID) {
    return <UserWarning />;
  }

  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const CompletedTodosCount = todos.filter(todo => todo.completed).length;

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => f.deleteTodo(todo.id));

    Promise.allSettled(deletePromises)
      .then(results => {
        console.log('Delete results:', results);

        const successfullyDeletedTodos = results
          .map((result, index) => {
            if (result.status === 'fulfilled') {
              return completedTodos[index].id;
            } else {
              console.log(
                `Failed to delete todo with ID: ${completedTodos[index].id}`,
              );

              return null;
            }
          })
          .filter(id => id !== null);

        console.log('Successfully deleted IDs:', successfullyDeletedTodos);

        setTodos(todos => {
          const updatedTodos = todos.filter(
            todo => !successfullyDeletedTodos.includes(todo.id),
          );

          console.log('Updated todos:', updatedTodos);

          return updatedTodos;
        });

        const failedDeletions = results.filter(
          result => result.status === 'rejected',
        );

        console.log('Failed deletions:', failedDeletions);

        if (failedDeletions.length > 0) {
          setErrorText('Unable to delete a todo');
        }
      })
      .catch(() => {
        setErrorText('Unable to clear completed todos');
      });
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = addTodoInput.trim();

    if (!trimmedTitle) {
      setErrorText('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.disabled = true;
    }

    const newTodo: NewTodo = {
      title: trimmedTitle,
      userId: f.USER_ID,
      completed: false,
    };

    const tempId = Date.now();
    const tempTodo = {
      id: tempId,
      completed: true,
      title: trimmedTitle,
      userId: f.USER_ID,
    };

    setLoadingTodoId(tempTodo.id);
    setTodos([...todos, tempTodo]);

    f.postTodo(newTodo)
      .then(createdTodo => {
        setAddTodoInput('');

        // eslint-disable-next-line @typescript-eslint/no-shadow
        setTodos(todos =>
          todos.map(todo => (todo.id === tempId ? createdTodo : todo)),
        );
        setLoadingTodoId(null);
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        setAddTodoInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setTodos(todos => todos.filter(todo => todo.id !== tempId));
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setLoadingTodoId(null);
        if (!addTodoInput.trim()) {
          setErrorText('Title should not be empty');
        } else {
          setErrorText('Unable to add a todo');
        }
      });
    setErrorText('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addTodoInput}
              onChange={event => setAddTodoInput(event.target.value)}
              ref={inputRef}
              disabled={!!loadingTodoId}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          setTodos={setTodos}
          loadingTodoId={loadingTodoId}
          setErrorText={setErrorText}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${notCompletedTodosCount} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {Object.values(Filter).map(status => (
                <a
                  key={status}
                  href="#/"
                  data-cy={`FilterLink${status}`}
                  onClick={() => setFilterBy(`${status}`)}
                  className={classNames(
                    'filter__link',
                    // eslint-disable-next-line prettier/prettier
                    { selected: filterBy === status }
                  )}
                >
                  {status}
                </a>
              ))}
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompletedTodos}
              disabled={CompletedTodosCount === 0}
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
          { hidden: !errorText },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorText('')}
        />
        {errorText}
        {/* show only one message at a time */}
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
