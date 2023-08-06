/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  todoTitle: string,
  setTodoTitle: (input: string) => void;
  isTodoLoading: boolean;
  numberCompletedTodos: number,
};

export const Header: React.FC<Props> = ({
  todosLength,
  onSubmit,
  todoTitle,
  setTodoTitle,
  isTodoLoading,
  numberCompletedTodos,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todosLength === numberCompletedTodos },
        )}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isTodoLoading}
        />
      </form>
    </header>
  );
};
