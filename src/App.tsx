/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { getTodos, createTodos, deleteTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const reset = () => {
    setError(null);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.UnableToLoadTodos);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const inputValue = newTodoField.current?.value.trim();

    if (!inputValue) {
      setError(ErrorMessage.TitleShouldNotBeEmpty);

      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    setIsInputDisabled(true);

    const newTodo: Todo = {
      id: 0,
      title: inputValue,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodos(newTodo)
      .then(createdTodo => {
        setTodos([...todos, createdTodo]);
        setTempTodo(null);
        if (newTodoField.current) {
          newTodoField.current.value = '';
        }
      })
      .catch(() => {
        setError(ErrorMessage.UnableToAddTodo);

        setTimeout(() => {
          setError('');
        }, 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);

        if (newTodoField.current) {
          newTodoField.current.focus();
        }
      });
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos, error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const updateTodoStatus = (todoId: number) => {
    setEditingTodoId(todoId);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    setEditingTodoId(null);
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoId(prev => [...prev, todoId]);

    deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setDeletingTodoId(prev => prev.filter(id => id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.UnableToDeleteTodo);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  const handleCompletedDelete = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(id => handleDeleteTodo(id));
  };

  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}

          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: areAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoField}
              disabled={isInputDisabled}
              onChange={reset}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
            >
              <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
                <input
                  id={`todo-${todo.id}`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => updateTodoStatus(todo.id)}
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active':
                    todos.length > 0 &&
                    (deletingTodoId.includes(todo.id) ||
                      editingTodoId === todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label
                className="todo__status-label"
                htmlFor={`todo-${tempTodo.id}`}
              >
                <input
                  id={`todo-${tempTodo.id}`}
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  disabled
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': tempTodo,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.values(Filter).map(status => (
                <a
                  key={status}
                  href={`#/${status}`}
                  className={cn('filter__link', {
                    selected: status === filterStatus,
                  })}
                  data-cy={`FilterLink${status}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={handleCompletedDelete}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
