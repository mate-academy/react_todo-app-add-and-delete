/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Errors } from './components/Errors';
import { TodoFilter } from './components/TodoFilter';
import { useTodos } from './context/TodoProvider';
import { TodoForm } from './components/TodoForm';
import { deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 12121;

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    todos, uncompletedCounter, setTodos, setErrorMessage,
  } = useTodos();

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length < 1) {
      return;
    }

    Promise.all(
      completedTodos.map(todo => deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null)),
    ).then(deletedTodosIds => {
      setTodos((prevTodos: Todo[]) => prevTodos
        .filter(todo => !deletedTodosIds.includes(todo.id)));
    })
      .catch(() => setErrorMessage('Unable to delete completed todos'));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoForm />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.length !== 0 && (
            <TodoList />
          )}

        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${uncompletedCounter} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <TodoFilter />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors />
    </div>
  );
};
