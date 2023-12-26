import React, { useContext, useEffect, useRef } from 'react';
import cn from 'classnames';
import { AppContext } from '../AppContext';
import { ErrorType } from '../types/Errors';

type Props = {
  isEveryTodosCompleted: boolean
};

export const Header: React.FC<Props> = (props) => {
  const { isEveryTodosCompleted } = props;
  const {
    todoTitle,
    setErrorMessage,
    isLoading,
    createNewTodo,
    setTodoTitle,

  } = useContext(AppContext);

  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoTitleRef.current && !todoTitleRef.current.disabled) {
      todoTitleRef.current.focus();
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!todoTitle.trim()) {
      setErrorMessage(ErrorType.TitleIsEmpty);

      setTimeout(() => setErrorMessage(null), 2000);

      return;
    }

    createNewTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="Toggle All"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isEveryTodosCompleted },
        )}
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoTitleRef}
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
