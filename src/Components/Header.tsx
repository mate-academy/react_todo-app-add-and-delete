import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  handleNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  addNewTodo: (title: string) => void,
  isDisabledInput: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  handleNewTitle,
  addNewTodo,
  isDisabledInput,
}) => {
  const isActive = todos.filter(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive },
        )}
        aria-label="Add todo"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addNewTodo(title);
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewTitle}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
