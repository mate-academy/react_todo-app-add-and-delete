import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  title: string;
  onTitleChange: (title: string) => void;
  inputFocusRef: React.RefObject<HTMLInputElement>;
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isTempTodo: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  onTitleChange,
  inputFocusRef,
  onFormSubmit,
  isTempTodo,
}) => {
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          ref={inputFocusRef}
          disabled={isTempTodo}
        />
      </form>
    </header>
  );
};
