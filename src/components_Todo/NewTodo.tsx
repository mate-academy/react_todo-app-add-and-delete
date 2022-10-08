import { FormEvent } from 'react';

interface Prors {
  newTodoField: React.RefObject<HTMLInputElement>;
  newTitleTodo: string;
  handleTitleTodo: (value: string) => void;
  handleAddTodo: (event: FormEvent) => void;
}

export const NewTodo: React.FC<Prors> = ({
  newTodoField,
  newTitleTodo,
  handleTitleTodo,
  handleAddTodo,
}) => {
  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleTitleTodo(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitleTodo}
          onChange={handleNewTitle}
        />
      </form>
    </header>
  );
};
