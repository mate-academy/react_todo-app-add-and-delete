/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addNewTodo: (title: string) => void;
  isAdding: boolean;
  showError: (message: string) => void;
};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  addNewTodo,
  isAdding,
  showError,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const resetForm = useCallback(() => {
    setNewTodoTitle('');
  }, []);

  const handleFormSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!newTodoTitle.trim()) {
        showError('Title can\'t be empty');
        resetForm();
      } else {
        await addNewTodo(newTodoTitle);
        resetForm();
      }
    } catch (err) {
      showError('Unable to add todo');
    }
  }, [newTodoTitle]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
