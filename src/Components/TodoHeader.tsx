import classNames from 'classnames';
import { FormEvent } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  allTodosCompleted: boolean,
  handleFormSubmit: (event: FormEvent) => void,
  title: string,
  handleTitleChange: (title: string) => void,
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  allTodosCompleted,
  handleFormSubmit,
  title,
  handleTitleChange,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            aria-label="btn"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allTodosCompleted,
            })}
          />
        )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
