import React from 'react';

type Props = {
  addTodo: string;
  setAddTodo: (value: string) => void;
  handleAddTodo: () => void;
  haveTodos: boolean;
  allCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isSubmiting: boolean;
  handleToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  addTodo,
  setAddTodo,
  handleAddTodo,
  haveTodos,
  allCompleted,
  inputRef,
  isSubmiting,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {haveTodos ? (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : null}`}
          onClick={() => {
            handleToggleAll();
          }}
        ></button>
      ) : null}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={addTodo}
          autoFocus
          onChange={e => setAddTodo(e.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
