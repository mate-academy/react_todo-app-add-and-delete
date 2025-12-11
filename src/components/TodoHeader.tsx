import React, { forwardRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  inputValue: string;
  isDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<Element>) => void;
  onChangeText: (title: string) => void;
  updateTodo: (id: number, completed: boolean) => void;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  (
    {
      todos,
      inputValue,
      isDisabled,
      isSubmitting,
      onChangeText,
      updateTodo,
      onSubmit,
    },
    ref,
  ) => (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            const shouldCompleteAll = !todos.every(todo => todo.completed);

            todos.forEach(todo => {
              updateTodo(todo.id, shouldCompleteAll);
            });
          }}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={ref}
          value={inputValue}
          onChange={e => onChangeText(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          disabled={isDisabled}
        />
        {isSubmitting && <div className="loader-inline" />}
      </form>
    </header>
  ),
);

Header.displayName = 'Header';
