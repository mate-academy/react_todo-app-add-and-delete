/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onFormSubmit: (event: React.FormEvent) => Promise<void>;
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  isCreating: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  onFormSubmit,
  todoTitle,
  setTodoTitle,
  isCreating,
}) => {
  const allTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: allTodosCompleted },
          )}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
