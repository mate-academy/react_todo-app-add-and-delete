import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddTodo: (title: string) => void;
  isAdding: boolean;
  title: string;
  setTitle: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  handleAddTodo,
  isAdding,
  title,
  setTitle,
}) => {
  const areAllCompleted = !!todos.length && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddTodo(title);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
