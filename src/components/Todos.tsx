/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoTitle: string,
  setNewTodoTitle: (title: string) => void,
};

export const Todos: React.FC<Props> = (
  {
    todos, onSubmit, newTodoTitle, setNewTodoTitle,
  },
) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.some((td) => !td.completed) },
        )}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
