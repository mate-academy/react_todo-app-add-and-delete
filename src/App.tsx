import { useState, useEffect, useRef } from 'react';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { HeaderTodo } from './components/HeaderTodo';
import { FilterTodo } from './components/FilterTodo';
import { useTodos } from './hooks/useTodos';
import { useErrorMessage } from './hooks/useErrorMessage';
import { filterTodos, FilterType } from './utils/todoFilters';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { errorMessage, setErrorMessage } = useErrorMessage();
  const {
    todos,
    isAdding,
    deletingIds,
    tempTodo,
    isClearing,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
  } = useTodos(setErrorMessage);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding && deletingIds.length === 0 && !isClearing) {
      inputRef.current?.focus();
    }
  }, [isAdding, deletingIds.length, isClearing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    try {
      await handleAddTodo(trimmedTitle, USER_ID);
      setNewTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await handleDeleteTodo(id);
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const handleClear = async () => {
    try {
      await handleClearCompleted();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filter, tempTodo);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          handlerSubmit={handleSubmit}
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAdding={isAdding}
          todos={todos}
        />

        <TodoList
          todos={filteredTodos}
          isAdding={isAdding}
          deletingIds={deletingIds}
          handlerDelete={handleDelete}
        />

        <FilterTodo
          todos={todos}
          filter={filter}
          setFilter={setFilter}
          handleClearCompleted={handleClear}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
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
