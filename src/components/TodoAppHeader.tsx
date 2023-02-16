/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  allTodosCompleted: boolean,
  disableInput: boolean,
  titleTodo: string,
  setTitleTodo: React.Dispatch<React.SetStateAction<string>>,
  addHandler: () => void,
};

export const TodoAppHeader: React.FC<Props> = ({
  allTodosCompleted,
  disableInput,
  titleTodo,
  setTitleTodo,
  addHandler,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: allTodosCompleted },
        )}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addHandler();
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={(event) => {
            if (!disableInput) {
              setTitleTodo(event.target.value);
            }
          }}
        />
      </form>
    </header>
  );
};
