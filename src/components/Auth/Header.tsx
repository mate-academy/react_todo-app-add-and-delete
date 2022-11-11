/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todosAreLoaded: boolean;
  addNewTodo: (event: React.FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  todosAreLoaded,
  addNewTodo,
  newTodoField,
  newTodoTitle,
  handleTitleChange,
  isAdding,
  todos,
}) => (
  <header className="todoapp__header">
    {todosAreLoaded && (
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
      />
    )}

    <form onSubmit={addNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        value={newTodoTitle}
        ref={newTodoField}
        disabled={isAdding}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleTitleChange}
      />
    </form>
  </header>
);
