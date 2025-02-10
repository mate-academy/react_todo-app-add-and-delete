import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onAdd: (newTodo: Omit<Todo, 'id'>) => void;
  onError: (newErrorOption: ErrorTypes) => void;
  isLoading: boolean;
  loadingTodoIds: number[];
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  titleRef,
  onAdd,
  onError,
  isLoading,
  loadingTodoIds,
}) => {
  useEffect(() => {
    titleRef.current?.focus();
  }, [titleRef, isLoading, loadingTodoIds]);

  const todosIsCompleted = todos.every(todo => todo.completed);

  function handleSubmit(event: React.FormEvent) {
    const formattedTitle = titleRef.current?.value.trim();

    event.preventDefault();

    if (formattedTitle) {
      onAdd({
        title: formattedTitle,
        userId: +USER_ID,
        completed: false,
      });
    } else {
      onError(ErrorTypes.EmptyTitle);
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosIsCompleted,
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
};
