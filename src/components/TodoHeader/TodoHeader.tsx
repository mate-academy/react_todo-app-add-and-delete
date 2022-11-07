import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  countOfTodos: number;
  onChangeTitle: (title: string) => void;
  todoTitle: string;
  createNewTodo: (title: string) => void;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = React.memo(({
  newTodoField,
  countOfTodos,
  onChangeTitle,
  todoTitle,
  createNewTodo,
  isAdding,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    createNewTodo(todoTitle);
  };

  return (
    <header className="todoapp__header">
      {
        countOfTodos > 0
        && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="active"
          />
        )
      }

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => onChangeTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
