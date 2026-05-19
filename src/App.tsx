import React, { useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodosList';
import { filterTodos } from './utils/filterTodos';
import { useError } from './hooks/useError';
import { AlertError } from './components/AlertError/AlertError';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const { error, showError, clearError } = useError();

  const {
    todos,
    tempTodo,
    deleteTodoById,
    deleteCompleted,
    createTodo,
    completedTodosCount,
    activeTodosCount,
  } = useTodos(showError);

  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('');

  const visibleTodos = filterTodos(todos, filterCompleted);

  const inputRef = useRef<HTMLInputElement>(null);

  function inputFocus() {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  async function handleCreateTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valueTrim = value.trim();

    if (!valueTrim) {
      showError('Title should not be empty');

      return;
    }

    setDisabled(true);
    try {
      await createTodo(valueTrim);
      setValue('');
    } catch {
    } finally {
      setDisabled(false);
      inputFocus();
    }
  }

  async function handleDelete(id: number) {
    await deleteTodoById(id);
    inputFocus();
  }

  async function handleDeleteCompletedTodos() {
    await deleteCompleted();
    inputFocus();
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

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
          <form onSubmit={handleCreateTodo}>
            <input
              ref={inputRef}
              autoFocus
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={e => setValue(e.target.value)}
              disabled={disabled}
            />
          </form>
        </header>
        <TodoList
          todos={visibleTodos}
          handleDelete={handleDelete}
          tempTodo={tempTodo}
        />

        {todos?.length > 0 && (
          <TodoFooter
            filterCompleted={filterCompleted}
            onCompleted={filter => setFilterCompleted(filter)}
            activeTodosCount={activeTodosCount}
            onDeleteAllTodos={handleDeleteCompletedTodos}
            completedTodos={completedTodosCount}
          />
        )}
      </div>

      <AlertError error={error} onClear={clearError} />
    </div>
  );
};
