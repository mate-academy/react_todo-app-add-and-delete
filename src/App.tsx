/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import type { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter, FILTERS } from './components/TodoFilter/TodoFilter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { createTodo } from './api/todos';
import { deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage === '') {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FILTERS.ACTIVE:
          return todo.completed === false;
        case FILTERS.COMPLETED:
          return todo.completed === true;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const allTodosCompleted = useMemo(() => {
    return todos.length > 0 && todos.every(todo => todo.completed === true);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onAddTodo(newTitle: string) {
    setIsCreating(true);
    setTempTodo({ userId: USER_ID, title: newTitle, completed: false, id: 0 });
    createTodo(newTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsCreating(false);
        setTempTodo(null);
      });
  }

  function onDeleteTodo(id: number) {
    setProcessingIds(prevIds => [...prevIds, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(prevIds => prevIds.filter(todoId => todoId !== id));
      });
  }

  function onClearCompleted() {
    todos
      .filter(todo => todo.completed === true)
      .forEach(todo => onDeleteTodo(todo.id));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodo
            onTitleChange={setTitle}
            setErrorMessage={setErrorMessage}
            onAddTodo={onAddTodo}
            title={title}
            isCreating={isCreating}
            isDeleting={processingIds.length > 0}
          />
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            processingIds={processingIds}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <TodoFilter filter={filter} onFilterChange={setFilter} />

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => todo.completed === false)}
              onClick={onClearCompleted}
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
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          onClick={() => setErrorMessage('')}
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        {errorMessage}
      </div>
    </div>
  );
};
