import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  todoInputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isAdding: boolean;
}

export const HeaderTodo: React.FC<Props> = ({
  todos,
  todoInputRef,
  title,
  setTitle,
  handleSubmit,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(t => t.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
