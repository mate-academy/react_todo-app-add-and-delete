import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  handleSubmit: (todo: Todo) => void,
};

export const USER_ID = 11712;

export const Header:React.FC<Props> = ({ handleSubmit }) => {
  const [value, setValue] = useState('');
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === '') {
      return;
    }

    // eslint-disable-next-line no-console
    console.log('success');

    handleSubmit({
      userId: USER_ID,
      title: value,
      id: +new Date(),
      completed: false,
    });
    setValue('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      /> */}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
