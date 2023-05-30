/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

type Props = {
  countActiveTodo: number,
  onHandleInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  inputValue: string,
  onHandleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  disabeled: boolean,
};

export const Header: React.FC<Props> = ({
  countActiveTodo,
  onHandleInput,
  inputValue,
  onHandleAddTodo,
  disabeled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          cn(
            'todoapp__toggle-all',
            { active: countActiveTodo > 0 },
          )
        }
      />

      <form onSubmit={onHandleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={onHandleInput}
          disabled={disabeled}
        />
      </form>
    </header>
  );
};
