/* eslint-disable max-len */
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import cn from 'classnames'; // Імпортуємо утиліту для класів
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

// Оголошуємо Enum для фільтрів
enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const todoFieldRef = useRef<HTMLInputElement>(null);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isAdding && !editingTodo && todoFieldRef.current) {
      todoFieldRef.current.focus();
    }
  }, [isAdding, editingTodo, todos.length]);

  useEffect(() => {
    if (editingTodo && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [editingTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(t => t.id !== todoId)))
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const handleUpdate = (todo: Todo, fields: Partial<Todo>) => {
    const updatedFields = { ...fields };

    if (updatedFields.title !== undefined) {
      const trimmedTitle = updatedFields.title.trim();

      if (trimmedTitle === todo.title) {
        setEditingTodo(null);

        return;
      }

      if (!trimmedTitle) {
        handleDelete(todo.id)
          .then(() => setEditingTodo(null))
          .catch(() => {});

        return;
      }

      updatedFields.title = trimmedTitle;
    }

    setLoadingTodoIds(prev => [...prev, todo.id]);
    updateTodo(todo.id, updatedFields)
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
        setEditingTodo(null);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(id => id !== todo.id)),
      );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: isAllCompleted })}
              data-cy="ToggleAllButton"
              onClick={() => {
                const target = !isAllCompleted;

                todos
                  .filter(t => t.completed !== target)
                  .forEach(t => handleUpdate(t, { completed: target }));
              }}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={todoFieldRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                data-cy="Todo"
                className={cn('todo', { completed: todo.completed })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() =>
                      handleUpdate(todo, { completed: !todo.completed })
                    }
                  />
                  <span className="is-hidden">Status</span>
                </label>

                {editingTodo?.id === todo.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleUpdate(todo, { title: editTitle });
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      ref={editFieldRef}
                      className="todo__title-field"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => handleUpdate(todo, { title: editTitle })}
                      onKeyUp={e => e.key === 'Escape' && setEditingTodo(null)}
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setEditingTodo(todo);
                        setEditTitle(todo.title);
                      }}
                    >
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
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    'is-active': loadingTodoIds.includes(todo.id),
                  })}
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
                    type="checkbox"
                    className="todo__status"
                    data-cy="TodoStatus"
                  />
                  <span className="is-hidden">Status</span>
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>
                <button type="button" className="todo__remove">
                  ×
                </button>
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {(todos.length > 0 || tempTodo) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={cn('filter__link', {
                  selected: filter === FilterType.All,
                })}
                onClick={() => setFilter(FilterType.All)}
              >
                All
              </a>
              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={cn('filter__link', {
                  selected: filter === FilterType.Active,
                })}
                onClick={() => setFilter(FilterType.Active)}
              >
                Active
              </a>
              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={cn('filter__link', {
                  selected: filter === FilterType.Completed,
                })}
                onClick={() => setFilter(FilterType.Completed)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(t => t.completed)}
              onClick={() =>
                todos
                  .filter(t => t.completed)
                  .forEach(t => handleDelete(t.id).catch(() => {}))
              }
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
          { hidden: !errorMessage },
        )}
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
