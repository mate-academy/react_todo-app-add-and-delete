import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const timerId = useRef<number | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (titleField.current && !isAdding) {
      titleField.current.focus();
    }
  }, [isAdding, todos.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      showError(ErrorMessage.TitleEmpty);

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    createTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDelete = (id: number) => {
    setDeletingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => showError(ErrorMessage.DeleteTodo))
      .finally(() => {
        setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
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

  const hasTodos = todos.length > 0 || tempTodo !== null;
  const activeTodosCount = todos.filter(t => !t.completed).length;
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}
          <form onSubmit={handleSubmit}>
            <input
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>
        {hasTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deletingIds={deletingIds}
              onDelete={handleDelete}
            />
            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodosCount} items left
                </span>
                <Filter filter={filter} onFilterChange={setFilter} />
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={todos.every(t => !t.completed)}
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
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
