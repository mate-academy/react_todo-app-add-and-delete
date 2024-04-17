import cn from 'classnames';
import { Todo } from './types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  isLoading: number | null;
  handleSubmit: () => void;
  newTitle: string;
  setNewTitle: (val: string) => void;
  todos: Todo[];
};

export const Header = ({
  isLoading,
  handleSubmit,
  newTitle,
  setNewTitle,
  todos,
}: Props) => {
  const selectInputTitle = useRef<HTMLInputElement>(null);
  const isAllActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (selectInputTitle.current) {
      selectInputTitle.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all ', { active: isAllActive })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={selectInputTitle}
          value={newTitle}
          disabled={isLoading !== null}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
