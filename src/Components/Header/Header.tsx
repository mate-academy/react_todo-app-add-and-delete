import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  filteredTodo: Todo[];
  completedTodo: Todo[];
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  filteredTodo,
  completedTodo,
  handleFormSubmit,
  setTitle,
  title,
}) => {
  return (
    <header className="todoapp__header">

      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: filteredTodo.length === completedTodo.length,
          },
        )}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
