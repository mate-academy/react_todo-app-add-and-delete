/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, getTodos, editTodo, deleteTodo } from './api/todos';
import { postTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  type FilterType = 'all' | 'active' | 'completed';
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }

    if (activeFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddingTodo = async (title: string) => {
    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAddingTodo(true);
    const temp = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    try {
      const createdTodo = await postTodo({
        title: newTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(current => [...current, createdTodo]);
      setNewTodoTitle('');
    } catch (e) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleToggleCompleted = async (
    todoId: number,
    currentStatus: boolean,
  ) => {
    setLoadingTodoIds([...loadingTodoIds, todoId]);
    try {
      const updatedTodo = await editTodo(todoId, { completed: !currentStatus });

      setTodos(current =>
        current.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (e) {
      setErrorMessage('Unable to update todo');
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleEditTitle = async (todoId: number) => {
    setLoadingTodoIds([...loadingTodoIds, todoId]);
    const newTitle = editingTitle.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');
      setLoadingTodoIds(current => current.filter(id => id !== todoId));

      return;
    }

    try {
      const updatedTodo = await editTodo(todoId, { title: newTitle });

      setTodos(current =>
        current.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );

      setEditingTodoId(null);
      setEditingTitle('');
    } catch (e) {
      setErrorMessage('Unable to update todo');
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
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
          <form
            onSubmit={e => {
              e.preventDefault();
              const trimmed = newTodoTitle.trim();

              if (trimmed) {
                handleAddingTodo(trimmed);
              } else {
                setErrorMessage('Title should not be empty');
              }
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={todo.completed ? 'todo completed' : 'todo'}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() =>
                    handleToggleCompleted(todo.id, todo.completed)
                  }
                />
              </label>

              {editingTodoId === todo.id ? (
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => handleEditTitle(todo.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleEditTitle(todo.id);
                      }
                    }}
                    autoFocus
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingTodoId(todo.id);
                    setEditingTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              )}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  handleDeleteTodo(todo.id);
                }}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={
                  loadingTodoIds.includes(todo.id)
                    ? 'modal overlay is-active'
                    : 'modal overlay'
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className='modal overlay is-active'
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  activeFilter === 'all'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => setActiveFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  activeFilter === 'active'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => setActiveFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  activeFilter === 'completed'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkCompleted"
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={async () => {
                const completedTodos = todos.filter(todo => todo.completed);
                const successfulIds: number[] = [];

                for (const todo of completedTodos) {
                  try {
                    await deleteTodo(todo.id);
                    successfulIds.push(todo.id);
                  } catch {
                    setErrorMessage('Unable to delete a todo');
                  }
                }

                setTodos(current =>
                  current.filter(todo => !successfulIds.includes(todo.id)),
                );
                inputRef.current?.focus();
              }}
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
        className={
          errorMessage
            ? 'notification is-danger is-light has-text-weight-normal'
            : 'notification is-danger is-light has-text-weight-normal hidden'
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
