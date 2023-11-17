import { useEffect, useRef, useState } from "react";
import { Error } from "../types/Error";
import { Todo } from "../types/Todo";

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  addTodo: (v: string) => void,
  setErrorMessage: (message: Error | '') => void
}

export const Header: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [])

  const handleSubmitTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Error.TitleEmpty);

      setTimeout(() => {
        setErrorMessage('')
      }, 3000);

      return;
    }

    addTodo(title);
    setTitle('')
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={handleSubmitTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={field}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
