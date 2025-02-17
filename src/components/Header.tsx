import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
  isLoading: boolean;
  focusField: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  title,
  setTitle,
  isLoading,
  focusField,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: todos.length > 0 && todos.every(todo => todo.completed),
      })}
      data-cy="ToggleAllButton"
    />

    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        ref={focusField}
        disabled={isLoading}
      />
    </form>
  </header>
);
