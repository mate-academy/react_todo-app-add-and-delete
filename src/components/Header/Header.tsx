/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  unfinishedTodos: Todo[];
  disabledInput: boolean;
  onTodoCreation: (title:string) => void;
};

export const Header: React.FC<Props> = ({
  unfinishedTodos,
  disabledInput,
  onTodoCreation,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          classNames(
            'todoapp__toggle-all',
            { active: unfinishedTodos.length > 0 },
          )
        }
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        onTodoCreation(todoTitle);
        setTodoTitle('');
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabledInput}
          value={todoTitle}
          onChange={(event) => {
            setTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
