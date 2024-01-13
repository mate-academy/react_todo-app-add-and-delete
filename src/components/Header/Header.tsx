import {
  memo, useEffect, useMemo, useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  title: string | null,
  isDisabled: boolean,
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleCreateTodo: (event: React.FormEvent) => void,
};
export const Header:React.FC<Props> = memo(({
  todos,
  title,
  isDisabled,
  handleChangeTitle,
  handleCreateTodo,
}) => {
  const inputNewTodoRef = useRef<HTMLInputElement>(null);

  const completedAll = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  useEffect(() => {
    if (inputNewTodoRef.current && !isDisabled) {
      inputNewTodoRef.current.focus();
    }
  }, [title, isDisabled]);

  return (
    <header className="todoapp__header">
      <button
        className={cn(
          'todoapp__toggle-all',
          { active: completedAll },
        )}
        type="button"
        data-cy="ToggleAllButton"
        aria-label="toggle-all"
      />

      <form onSubmit={handleCreateTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputNewTodoRef}
          disabled={isDisabled}
          value={title ?? ''}
          onChange={handleChangeTitle}
        />
      </form>
    </header>
  );
});
