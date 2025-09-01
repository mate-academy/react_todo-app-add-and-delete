/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredTodos = useMemo(() => {
    const list = [...todos];

    if (tempTodo) {
      list.push(tempTodo);
    }

    return list.filter(todo => {
      switch (status) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, tempTodo, status]);

  useEffect(() => {
    if (!isAdding && !selectedTodo) {
      const input = document.querySelector<HTMLInputElement>(
        'input.todoapp__new-todo',
      );

      input?.focus();
    }
  }, [isAdding, todos.length, selectedTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('NewTodoField') as HTMLInputElement;
    const title = input.value.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const tempId = Date.now();
    const newTemp: Todo = {
      id: tempId,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTemp);
    setProcessingIds(prev => [...prev, tempId]);
    setIsAdding(true);
    setError(null);

    addTodo(title)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTempTodo(null);
        form.reset();
      })
      .catch(() => {
        setTempTodo(null);
        setError('Unable to add a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== tempId));
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setError(null);
    setProcessingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todoId));
        if (selectedTodo?.id === todoId) {
          setSelectedTodo(null);
        }
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() =>
        setProcessingIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const handleUpdateTodo = (todoId: number, data: Partial<Todo>) => {
    setError(null);
    setProcessingIds(prev => [...prev, todoId]);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todoId ? updatedTodo : t)),
        );
        setSelectedTodo(null);
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() =>
        setProcessingIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const handleEditTodo = (todo: Todo) => {
    if (!todo.title.trim()) {
      setSelectedTodo({ ...todo, title: '' });

      return;
    }

    if (todos.find(t => t.id === todo.id)?.title !== todo.title) {
      handleUpdateTodo(todo.id, { title: todo.title });
    } else {
      setSelectedTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${
              todos.length > 0 && todos.every(t => t.completed) ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              name="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''} ${
                selectedTodo?.id === todo.id ? 'editing' : ''
              }`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  disabled={tempTodo?.id === todo.id}
                  onChange={() =>
                    todo.id !== tempTodo?.id &&
                    handleUpdateTodo(todo.id, { completed: !todo.completed })
                  }
                />
              </label>

              {selectedTodo?.id === todo.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleEditTodo(selectedTodo);
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder={
                      selectedTodo.title.trim() === ''
                        ? 'Empty todo will be deleted'
                        : ''
                    }
                    value={selectedTodo.title}
                    onChange={e =>
                      setSelectedTodo({
                        ...selectedTodo,
                        title: e.target.value,
                      })
                    }
                    onBlur={() => handleEditTodo(selectedTodo)}
                    onKeyUp={e => {
                      if (e.key === 'Escape') {
                        setSelectedTodo(null);
                      }
                    }}
                    autoFocus
                  />
                </form>
              ) : (
                <>
                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    disabled={tempTodo?.id === todo.id}
                    onClick={() =>
                      todo.id !== tempTodo?.id && handleDeleteTodo(todo.id)
                    }
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${
                  processingIds.includes(todo.id) ? 'is-active' : ''
                }`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(t => !t.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={`filter__link ${status === 'all' ? 'selected' : ''}`}
                onClick={() => setStatus('all')}
              >
                All
              </a>
              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={`filter__link ${
                  status === 'active' ? 'selected' : ''
                }`}
                onClick={() => setStatus('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={`filter__link ${
                  status === 'completed' ? 'selected' : ''
                }`}
                onClick={() => setStatus('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(t => t.completed)}
              onClick={() => {
                const completedIds = todos
                  .filter(t => t.completed)
                  .map(t => t.id);

                completedIds.forEach(id => handleDeleteTodo(id));
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          error ? '' : 'hidden'
        }`}
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
