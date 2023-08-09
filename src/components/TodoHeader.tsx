/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (title: string) => void,
  isLoading: boolean
};

export const TodoHeader: React.FC<Props> = ({
  todos, onSubmit, title, setTitle, isLoading,
}) => {
  const isSomeVisible = !!todos.length;
  const isEveryCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {isSomeVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isEveryCompleted,
          })}
        />
      )}

      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
