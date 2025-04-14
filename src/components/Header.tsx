import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  titleField: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAllCompleted: () => void;
  isAdding: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  titleField,
  todoTitle,
  handleTitleChange,
  handleAllCompleted,
  isAdding,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllCompleted}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
