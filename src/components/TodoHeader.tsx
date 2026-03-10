import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { Error } from '../types/ErrorMsg';

type Props = {
  isSubmiting: boolean;
  todos: Todo[];
  todoTitle: string;
  setTodoTitle: (todoTitle: string) => void;
  setErrorMsg: (error: Error) => void;
  onAddTodo: (title: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  isSubmiting,
  todoTitle,
  setTodoTitle,
  setErrorMsg,
  onAddTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isSubmiting) {
      inputRef.current?.focus();
    }
  }, [isSubmiting, todos]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (todoTitle.trim().length === 0) {
      return setErrorMsg(Error.EmptyTitle);
    }

    onAddTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
