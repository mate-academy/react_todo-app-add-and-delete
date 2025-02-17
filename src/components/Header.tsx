import classNames from 'classnames';
import { FC, FormEvent, memo, useEffect, useMemo } from 'react';
import { Todo } from '../types';
import React from 'react';

type Props = {
  isLoading: boolean;
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onShowError: (err: string) => void;
  onFormSubmit: (title: Todo['title']) => void;
};

export const Header: FC<Props> = memo(
  ({ isLoading, todos, titleRef, onShowError, onFormSubmit }) => {
    useEffect(() => {
      titleRef.current?.focus();
    });

    const isAllTodosCompleted = useMemo(
      () => todos.every(({ completed }) => completed),
      [todos],
    );

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fieldValue = titleRef.current?.value?.trim();

      if (!fieldValue) {
        onShowError('Title should not be empty');

        return;
      }

      onFormSubmit(fieldValue);
    };

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all ', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={titleRef}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'HeaderMemo';
