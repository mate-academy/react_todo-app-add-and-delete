import { useEffect, useRef } from 'react';
import { Error } from '../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  title: string,
  isDisable: boolean,
  setTitle: (value: string) => void,
  setErrorMessage: (message: Error | '') => void,
  addTodo: (v: string) => void,
}

export const Header: React.FC<Props> = ({
  title,
  isDisable,
  setTitle,
  setErrorMessage,
  addTodo,
}) => {
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [isDisable]);

  const handleSubmitTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Error.TitleEmpty);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    addTodo(title);
  };

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
          disabled={isDisable}
        />
      </form>
    </header>
  );
};
