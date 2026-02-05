import React, { FormEvent, ForwardedRef, forwardRef } from 'react';

type Props = {
  onTodoTitleChange: (todoTitle: string) => void;
  todoTitle: string;
  onAddTodo: () => void;
  disabled?: boolean;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  function HeaderComponent(
    { onTodoTitleChange, todoTitle, onAddTodo, disabled = false }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) {
    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      // ВАЖЛИВО: Ми просто викликаємо функцію.
      // Ніяких перевірок if (disabled) тут бути не повинно!
      onAddTodo();
    }

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleFormSubmit}>
          <input
            ref={ref}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={event => onTodoTitleChange(event.target.value)}
            disabled={disabled}
          />
        </form>
      </header>
    );
  },
);
