import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  allTodosCompleted: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  titleInput: string;
  handleTitileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.LegacyRef<HTMLInputElement>;
  isSubmitting: boolean;
  reset: () => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  allTodosCompleted,
  handleSubmit,
  inputRef,
  titleInput,
  handleTitileChange,
  isSubmitting,
  reset,
}) => {
  return (
    <>
      {/* this button should have `active` class only if all todos are completed*/}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        action="/api/todos"
        method="POST"
        onSubmit={handleSubmit}
        onReset={() => reset()}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={titleInput}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitileChange}
          disabled={isSubmitting}
        />
      </form>
    </>
  );
};
