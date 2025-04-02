import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  onAddTodo: (title: string) => void;
  isLoading: boolean;
  selectedTodo: Todo[];
  handleToggleTodo: (id: number, status: boolean) => void;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  onAddTodo,
  isLoading,
  selectedTodo,
  handleToggleTodo,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [onAddTodo]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      inputRef.current?.focus();
    }

    onAddTodo(newTodoTitle);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && !!selectedTodo.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active:
              selectedTodo.length > 0 &&
              selectedTodo.every((todo: Todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            const newStatus = !selectedTodo.every(todo => todo.completed);

            selectedTodo.forEach(todo => handleToggleTodo(todo.id, newStatus));
          }}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
