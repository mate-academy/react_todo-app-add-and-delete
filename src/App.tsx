/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [idListForDelete, setIdListForDelete] = useState<number[]>([]);

  const focusField = useRef<HTMLInputElement>(null);
  const handleError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    postService
      .getTodos(postService.USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        handleError('Unable to load todos');

        return <UserWarning />;
      });
  }, []);

  useEffect(() => {
    if (focusField.current) {
      focusField.current.focus();
    }
  }, [tempTodo]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const titleChecked = title.trim();

    if (!titleChecked) {
      handleError('Title should not be empty');

      return;
    }

    const currentTodo = {
      id: 0,
      title: titleChecked,
      userId: postService.USER_ID,
      completed: false,
    };

    setTempTodo(currentTodo);

    postService
      .addTodo(currentTodo)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        handleError(`Unable to add a todo`);

        return <UserWarning />;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (idsForDelete: number[]) => {
    setIdListForDelete(idsForDelete);

    for (let i = 0; i < idsForDelete.length; i++) {
      const todoForDelete = {
        id: idsForDelete[i],
        title,
        userId: postService.USER_ID,
        completed: false,
      };

      setTempTodo(todoForDelete);

      postService
        .delTodo(idsForDelete[i])
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== idsForDelete[i]),
          );
        })
        .catch(() => {
          handleError(`Unable to delete a todo`);
          setTempTodo(null);
          setIdListForDelete([]);

          return <UserWarning />;
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const onDeleteCompletedTodos = () => {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    deleteTodo(completedTodos);
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const todoCounter = todos.filter(todo => !todo.completed).length;
  const completedTodoCounter = todos.length - todoCounter;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todoCounter === 0,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              value={title}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={focusField}
              disabled={!!tempTodo}
              onChange={event => setTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoInfo
                  key={todo.id}
                  todoInfo={todo}
                  onDelete={deleteTodo}
                  todosForDelete={idListForDelete}
                />
              </CSSTransition>
            ))}

            {tempTodo?.id === 0 && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem tempTitle={tempTodo.title} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todoCounter} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === Filter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === Filter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === Filter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodoCounter}
              data-cy="ClearCompletedButton"
              onClick={onDeleteCompletedTodos}
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
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
        {/*
        Unable to update a todo
        */}
      </div>
    </div>
  );
};
