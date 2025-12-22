import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  handleSubmit: (event: React.FormEvent) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  todoInputRef: React.RefObject<HTMLInputElement>;
  allCompleted: boolean;
  title: string;
  isDisabledInput: boolean;
}

export const TodoHeader: React.FC<Props> = ({
  handleSubmit,
  setTitle,
  todoInputRef,
  allCompleted,
  title,
  todos,
  isDisabledInput,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={isDisabledInput}
          autoFocus
        />
      </form>
    </header>
  );
};
