/* eslint-disable jsx-a11y/control-has-associated-label */

import { FC, useState } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todo: string) => void;
  setErrors: (errors: Errors | null) => void;
  tempTodo: Todo | null;
};

export const Header: FC<Props> = ({ addTodo, setErrors, tempTodo }) => {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const todoTitle = inputValue.trim();

    if (!todoTitle) {
      setErrors({ noTitle: true });

      return;
    }

    addTodo(todoTitle);
    setInputValue('');
  }

  return (
    <header className="todoapp__header">
      {/* these buttons are active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
