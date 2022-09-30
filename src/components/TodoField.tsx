import classNames from 'classnames';
import { RefObject } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  ref: RefObject<HTMLInputElement>;
  todos: Todo[];
  onAdd: (newTodoData: string) => void;
  todoName: string;
  setNewTodoName: (name: string) => void;
  addingError: (error: boolean) => void;
  isAdding: boolean;
};

export const TodoField: React.FC<Props> = ({
  ref, todos, todoName, onAdd, setNewTodoName, addingError, isAdding,
}) => {
  const completedTodos = todos.every((todo) => todo.completed === true);

  return (
    <>
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            ('todoapp__toggle-all'),
            { active: completedTodos },
          )}
          aria-label="Toggle"
        />
      )}
      <form onSubmit={(event) => {
        event.preventDefault();

        if (!todoName.trim()) {
          addingError(true);
        } else {
          onAdd(todoName);
          addingError(false);
        }

        setNewTodoName('');
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isAdding}
          ref={ref}
          className="todoapp__new-todo"
          placeholder="What me do?"
          value={todoName}
          onChange={(event) => setNewTodoName(event.target.value)}
        />
      </form>
    </>
  );
};
