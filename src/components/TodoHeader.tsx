import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Error } from '../types/ErrMsg';

type Props = {
  isSubmitting: boolean;
  todos: Todo[];
  todoTitle: string;
  areAllCompleted: boolean;
  setTodoTitle: (todoTitle: string) => void;
  setErrMsg: (error: Error) => void;
  onAddTodo: (title: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  areAllCompleted,
  isSubmitting,
  todoTitle,
  setTodoTitle,
  setErrMsg,
  onAddTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, todos]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (todoTitle.trim().length === 0) {
      return setErrMsg(Error.EmptyTitle);
    }
    onAddTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
