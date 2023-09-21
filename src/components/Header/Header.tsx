/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
};

// type Props = {
//   todos: boolean,
// };

export const Header: React.FC<Props> = ({ todos }) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
