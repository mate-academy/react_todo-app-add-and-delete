import { useEffect } from 'react';
import { OmitTodo, Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { ErrorStatus } from '../types/ErrorStatus';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onAdd: (newTodo: OmitTodo) => void;
  onError: (error: ErrorStatus) => void;
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

  const completedTodos = todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedTitle = titleRef.current?.value.trim();

    if (formattedTitle) {
      onAdd({
        title: formattedTitle,
        userId: USER_ID,
        completed: false,
      });
    } else {
      onError(ErrorStatus.EMPTY_TITLE);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
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
