import { Ref } from 'react';

type Props = {
  handleTitleChange: (title: string) => void;
  newTodoTitle: string;
  createTodo: () => void;
  todoInput: Ref<HTMLInputElement>;
  isNewTodoLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  handleTitleChange,
  newTodoTitle,
  createTodo,
  todoInput,
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
          ref={todoInput}
          value={newTodoTitle}
          onChange={event => handleTitleChange(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
