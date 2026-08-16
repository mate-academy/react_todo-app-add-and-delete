/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { ErrorMessage } from './types/ErrorMessage';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const filterLinks = [
  { status: FilterStatus.All, text: 'All', href: '#/' },
  { status: FilterStatus.Active, text: 'Active', href: '#/active' },
  { status: FilterStatus.Completed, text: 'Completed', href: '#/completed' },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempQuery, setTempQuery] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompletedTodos = todos.some(t => t.completed);
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedTitle = tempQuery.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsSubmitting(true);

    const newTempTodo: Todo = {
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    addTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTempQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);

        setTimeout(() => {
          if (newTodoField.current) {
            newTodoField.current.focus();
          }
        }, 0);
      });
  };

  const handleDelete = (id: number) => {
    setProcessingIds(prev => [...prev, id]); // Вмикаємо лоадер

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(prevId => prevId !== id)); // Вимикаємо лоадер

        setTimeout(() => {
          if (newTodoField.current) {
            newTodoField.current.focus();
          }
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={tempQuery}
              onChange={e => setTempQuery(e.target.value)}
              disabled={isSubmitting} // Блокуємо під час запиту
              ref={newTodoField}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={processingIds.includes(todo.id)}
                onDelete={handleDelete}
              />
            ))}

            {tempTodo && (
              <TodoItem todo={tempTodo} isLoading={true} onDelete={() => {}} />
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {filterLinks.map(link => (
                <a
                  key={link.status}
                  href={link.href}
                  className={`filter__link ${filter === link.status ? 'selected' : ''}`}
                  data-cy={`FilterLink${link.text}`}
                  onClick={() => setFilter(link.status)}
                >
                  {link.text}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessage.None)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
