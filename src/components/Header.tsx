import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  addTodo: (title: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  newTodoTitle,
  setNewTodoTitle,
  isDisabled,
}) => {
  const isActive = todos.filter((todo) => !todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: isActive })}
        aria-label="saveButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
