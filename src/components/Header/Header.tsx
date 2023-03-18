/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (value: string) => void,
  tempTodo: Todo | null,
};

export const Header: React.FC<Props> = ({
  addTodo,
  tempTodo,
}) => {
  const [value, setValue] = useState('');
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(value);
    setValue('');
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />
      <form onSubmit={onSubmit}>
        <input
          disabled={!!tempTodo}
          name="title"
          value={value}
          onChange={changeValue}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
