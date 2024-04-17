import cn from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  handleSubmit: () => void;
  newTitle: string;
  setNewTitle: (val: string) => void;
  todos: Todo[];
};

export const Header = ({
  handleSubmit,
  newTitle,
  setNewTitle,
  todos,
}: Props) => {
  const isAllActive = todos.every(todo => todo.completed);

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
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
