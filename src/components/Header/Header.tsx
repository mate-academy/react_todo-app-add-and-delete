/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useEffect, useRef, useState,
} from 'react';
import { Error } from '../../types/Error';

type Props = {
  addTodo: (title: string) => Promise<void>,
  showError: (error: string) => void,
};

export const Header: FC<Props> = ({ addTodo, showError }) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [titleDisabled, seTitleDisabled] = useState(false);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [titleDisabled]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      showError(Error.NotAdd);

      return;
    }

    seTitleDisabled(true);
    addTodo(title)
      .then(() => setTodoTitle(''))
      .finally(() => {
        seTitleDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={titleDisabled}
          ref={todoTitleRef}
        />
      </form>
    </header>
  );
};
