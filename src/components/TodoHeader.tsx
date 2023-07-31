import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  setTitle: (e: string) => void,
  handleSubmit: (e: React.FormEvent) => void,
  isDisabled: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTitle,
  handleSubmit,
  title,
  isDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length !== 0
        && (
          // eslint-disable-next-line
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.some(todo => todo.completed) },
            )}
          />
        )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          disabled={isDisabled}
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
