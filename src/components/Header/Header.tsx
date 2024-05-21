import React, {FC, FormEventHandler, useEffect, useRef} from "react";

export interface Props{
  handleAddTodo: FormEventHandler<HTMLFormElement>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

const Header: FC<Props> = ({handleAddTodo, newTodoTitle, setNewTodoTitle, isLoading}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

export default Header;
