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
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={
          cn(
            'todoapp__toggle-all',
            { active: countActiveTodo > 0 },
          )
        }
      />

      {/* Add a todo on form submit */}
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
