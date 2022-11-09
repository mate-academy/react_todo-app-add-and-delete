import classNames from 'classnames';
import { RefObject } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  newTodo: RefObject<HTMLInputElement>,
  isAdding: boolean,
  addNewTodo: () => void,
  setTodo: (value: string) => void,
  todo: string,
};

export const TodoField: React.FC<Props> = ({
  todos, newTodo, isAdding, addNewTodo, setTodo, todo,
}) => {
  const completedTodos = todos
    .every((todo) => todo.completed === true);

  return (
    <header className="todoapp__header">
      <button
        aria-label="ToggleAllButton"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          ('todoapp__toggle-all'),
          { active: completedTodos },
        )}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addNewTodo();
        }}
      >
        <input
          data-cy="NewTodoField"
          disabled={isAdding}
          type="text"
          ref={newTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={(event) => setTodo(event.target.value)}
        />
      </form>
    </header>
  );
};
