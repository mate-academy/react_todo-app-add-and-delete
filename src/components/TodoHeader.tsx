import { Ref } from 'react';

type Props = {
  handleChangeTitle: (title: string) => void;
  addTodoTitle: string;
  createTodo: () => void;
  newTodoInput: Ref<HTMLInputElement>;
  isNewTodoLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  handleChangeTitle,
  addTodoTitle,
  createTodo,
  newTodoInput,
  isNewTodoLoading,
}) => {
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createTodo();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isNewTodoLoading}
          ref={newTodoInput}
          value={addTodoTitle}
          onChange={event => handleChangeTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
