import { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface HeaderProps {
  inputRef: RefObject<HTMLInputElement>;
  todos: Todo[];
  title: string;
  newTitle: (title: string) => void;
  onAdd: (event: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  todos,
  title,
  newTitle,
  onAdd,
}) => {
  const everyTodoCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: everyTodoCompleted })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => newTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
