// #region imports
import { useEffect } from 'react';
import cn from 'classnames';

import { USER_ID } from '../api/todos';
import { OmitTodo, Todo } from '../types/Todo';
import { ErrorOptions } from '../types/ErrorOptions';
// #endregion

// #region type Props
type Props = {
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onAdd: (newTodo: OmitTodo) => void;
  onError: (newErrorOption: ErrorOptions) => void;
  isLoading: boolean;
  loadingTodoIds: number[];
};
// #endregion

export default function Header({
  todos,
  titleRef,
  onAdd,
  onError,
  isLoading,
  loadingTodoIds,
}: Props) {
  useEffect(() => {
    titleRef.current?.focus();
  }, [titleRef, isLoading, loadingTodoIds]);

  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  // #region event handlers
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formattedTitle = titleRef.current?.value.trim();

    if (formattedTitle) {
      onAdd({
        title: formattedTitle,
        userId: USER_ID,
        completed: false,
      });
    } else {
      onError(ErrorOptions.EMPTY);
    }
  }
  // #endregion

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: hasAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
}
