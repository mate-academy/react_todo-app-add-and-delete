import React from 'react';
import { Todo } from '../../types/Todo';
import { handleError } from '../../utils/utils';

type Props = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  setError: (error: string) => void;
  setIsErrorVisible: (isVisible: boolean) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'userId'>) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
};

export const TodoHeader: React.FC<Props> = React.memo(
  ({
    searchQuery,
    setSearchQuery,
    setError,
    setIsErrorVisible,
    addTodo,
    inputRef,
    isLoading = false,
  }) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery === '') {
        handleError('Title should not be empty', setError, setIsErrorVisible);

        return;
      }

      try {
        await addTodo({
          title: trimmedQuery,
          completed: false,
        });
        setSearchQuery('');
      } catch (error) {
        handleError((error as Error).message, setError, setIsErrorVisible);
      }
    };

    const handleSearchQueryChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const enteredValue = event.target.value;

      setSearchQuery(enteredValue);
    };

    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={inputRef}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

TodoHeader.displayName = 'TodoHeader';
