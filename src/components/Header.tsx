import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: (title: string) => void;
  handleAddTodo: (e: React.FormEvent) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  loading,
  setLoading,
  title,
  setTitle,
  inputRef,
}) => {
  const activeTodoExist = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTodoExist,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => {
            setTitle(event.target.value);
            setLoading(false);
          }}
          disabled={loading}
        />
      </form>
    </header>
  );
};
