import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  isLoading: boolean;
  handleChangeNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmptyLineError: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  isLoading,
  handleChangeNewTitle,
  handleEmptyLineError,
}) => {
  const allChecked = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allChecked,
        })}
        data-cy="ToggleAllButton"
        disabled={isLoading}
      />

      <form onSubmit={handleEmptyLineError}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTodoTitle}
          onChange={handleChangeNewTitle}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
