import React from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  titleTodo: string;
  setTitleTodo: (value: string) => void;
  handleSubmit: (
    event: React.FormEvent,
    { title, userId, completed }: Omit<Todo, 'id'>,
  ) => void;
  todoInputIsActive: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  titleTodo,
  setTitleTodo,
  handleSubmit,
  todoInputIsActive,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event =>
          handleSubmit(event, {
            title: titleTodo,
            userId: USER_ID,
            completed: false,
          })
        }
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={event => setTitleTodo(event.target.value)}
          disabled={!todoInputIsActive}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
