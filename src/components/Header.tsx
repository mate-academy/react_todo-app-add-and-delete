import { useEffect } from 'react';

interface Props {
  updateAll: () => void;
  handleAdd: () => void;
  editTodo: string;
  setEditTodo: (a: string) => void;
  disabledInput: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  updateAll,
  handleAdd,
  editTodo,
  setEditTodo,
  disabledInput,
  inputRef,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
        onClick={updateAll}
      ></button>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          ref={inputRef}
          value={editTodo}
          disabled={disabledInput}
          onChange={e => setEditTodo(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
