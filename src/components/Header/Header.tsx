import cn from 'classnames';
import { useContext, useEffect, useRef } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { AppContext } from '../../contexts/appContext';

interface Props{
  isEveryTodosCompleted: boolean,
}

export const Header: React.FC<Props> = ({ isEveryTodosCompleted }) => {
  const {
    todoTitle,
    setTodoTitle,
    createNewTodo,
    setErrorMessage,
    isLoading,
    displayError,
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
      displayError(ErrorType.TitleIsEmpty);

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

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          ref={todoTitleRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
