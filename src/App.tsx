/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
}
enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);

  const showError = useCallback((message: string = 'Error') => {
    setErrorMessage(message);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  function loadTodos() {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      })
      .finally(() => newTodoRef.current?.focus());
  }

  useEffect(loadTodos, [showError]);

  useEffect(() => {
    if (!isAdding) {
      newTodoRef.current?.focus();
    }
  }, [isAdding]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return todos;
    }
  }, [filter, todos]);

  const visibleTodosResult = tempTodo
    ? [...visibleTodos, tempTodo]
    : visibleTodos;

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Empty);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsAdding(true);

    try {
      const created = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, created]);
      setInputValue('');
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
      newTodoRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    await Promise.all(
      completed.map(async todo => {
        try {
          await deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          showError(ErrorMessage.Delete);
        }
      }),
    );

    newTodoRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && completedTodosCount === todos.length ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={() => {
              setTodos(prev =>
                prev.map(todo => ({
                  ...todo,
                  completed: completedTodosCount !== todos.length,
                })),
              );
            }}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={e => {
              e.preventDefault();
              const title = newTodoRef.current?.value.trim();

              if (!title) {
                showError('Title should not be empty');

                return;
              }

              handleAddTodo(title);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodosResult.map(todo => (
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
                      (isAdding && tempTodo?.id === todo.id) ||
                      loadingIds.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filter === Filter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === Filter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === Filter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
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
