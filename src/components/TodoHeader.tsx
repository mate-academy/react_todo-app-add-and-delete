import React from 'react';
import { useEffect, useRef } from 'react';

interface Props {
  addTodo: (newTodoTitle: string) => void;
  titleField: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoHeader: React.FC<Props> = ({
  titleField,
  title,
  setTitle,
  addTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={title}
          onChange={event => setTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
