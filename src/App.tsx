import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoForm } from './components/TodoForm';

function getFilteredTodos(todos: Todo[], filter: Filter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);

    case 'completed':
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const filteredTodos = getFilteredTodos(todos, filter);

  useEffect(() => {
    if (!tempTodo && deletingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, deletingTodoIds]);

  useEffect(() => {
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (trimmedTitle.length === 0) {
      setError(ErrorMessage.TitleValue);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessage.AddTodo);
      })
      .finally(() => {
        inputRef.current?.focus();
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

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
          <TodoForm
            query={query}
            setQuery={setQuery}
            onSubmit={handleAddTodo}
            disabled={!!tempTodo}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            onClear={() => {
              todos
                .filter(todo => todo.completed)
                .forEach(todo => handleDeleteTodo(todo.id));
            }}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
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
