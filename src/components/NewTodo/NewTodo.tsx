import React, { useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addNewTodo: (todoTitle: string) => Promise<void>;
  isTodoAdding: boolean;
};

export const NewTodo: React.FC<Props> = React.memo(({
  newTodoField, addNewTodo, isTodoAdding,
}) => {
  const [titleField, setTitleField] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleField(event.target.value);
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (titleField.trim()) {
      addNewTodo(titleField);

      setTitleField('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="All todos active"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleField}
          onChange={handleInput}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
});
