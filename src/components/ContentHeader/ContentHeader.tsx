/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

interface Props {
  onAddTodo: (arg: string) => void;
  query: string;
  onQueryChange: (arg: string) => void;
  isLoading: boolean;
  onErrorMessageChange: (arg: string) => void;
  setIsLoading: (arg: boolean) => void;
}

export const ContentHeader: React.FC<Props> = ({
  onAddTodo,
  query,
  onQueryChange,
  isLoading,
  onErrorMessageChange,
  setIsLoading,
}) => {
  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      onErrorMessageChange('Title can\'t be empty');
      setTimeout(() => {
        onErrorMessageChange('');
      }, 3000);

      return;
    }

    try {
      setIsLoading(true);
      onAddTodo(query);
      onQueryChange('');
    } catch {
      onErrorMessageChange('Unable to add todo title');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label=""
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmitForm}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={isLoading}
          // createTodo({query, 10888, false});
        />
      </form>
    </header>
  );
};
