import classNames from 'classnames';
import React, { forwardRef } from 'react';

type HeaderProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isAllTodosCompleted: () => boolean;
};

export const MyInput = forwardRef(function MyInput(
  props: HeaderProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const { onSubmit, isAllTodosCompleted } = props;

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllTodosCompleted(),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="Co trzeba zrobić?"
          ref={ref}
        />
      </form>
    </header>
  );
});
