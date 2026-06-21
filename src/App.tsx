/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputText, setInputText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoId, setTodoId] = useState<number[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = inputText.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    try {
      const newTodoFromServer = await createTodo({
        userId: USER_ID,
        title: normalizedTitle,
        completed: false,
      });

      setTodos([...todos, newTodoFromServer]);
      setInputText('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);

      if (newTodoField.current) {
        setTimeout(() => newTodoField.current?.focus(), 0);
      }
    }
  };

  const handleDelete = async (todoID: number) => {
    setProcessingIds(currentIds => [...currentIds, todoID]);

    try {
      await deleteTodo(todoID);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoID));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoID));

      if (newTodoField.current) {
        setTimeout(() => newTodoField.current?.focus(), 0);
      }
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'completed') {
      return todo.completed;
    }

    if (filter === 'active') {
      return !todo.completed;
    }

    return true;
  });

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

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={event => setInputText(event.target.value)}
              disabled={!!tempTodo}
              ref={newTodoField}
              autoFocus={true}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    checked={todo.completed}
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${processingIds.includes(todo.id) ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {tempTodo && (
          <div data-cy="Todo" className="todo" key="0">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                checked={false}
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={event => {
                  event.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={event => {
                  event.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={event => {
                  event.preventDefault();
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
