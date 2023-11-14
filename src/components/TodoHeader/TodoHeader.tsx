import {
  useEffect, useRef, useState,
} from 'react';

type Props = {
  setErrorMessage: (m: string) => void,
  isDisable: boolean,
  addTodo: (t: string, st: (t: string) => void) => void,
};

export const TodoHeader:React.FC<Props> = ({
  setErrorMessage,
  isDisable,
  addTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [isDisable]);

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    addTodo(todoTitle, setTodoTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="ToggleAll"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          ref={todoField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisable}
          value={todoTitle}
          onChange={(ev) => setTodoTitle(ev.target.value)}
        />
      </form>
    </header>
  );
};
