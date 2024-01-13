import { useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
};
export const Header:React.FC<Props> = ({ todos }) => {
  const completedAll = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

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

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
