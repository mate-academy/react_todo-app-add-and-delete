/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  handleToggleAllTodos: () => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  isInterfaceHidden: boolean,
  isAdding: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoField,
  handleToggleAllTodos,
  handleSubmit,
  isInterfaceHidden,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      {!isInterfaceHidden && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            (todos.every((todo) => todo.completed) && todos.length !== 0)
              ? 'active'
              : '',
          )}
          onClick={() => handleToggleAllTodos()}
        />
      )}

      <form
        onSubmit={(event) => handleSubmit(event)}
      >
        <input
          data-cy="NewTodoField"
          name="todoTitle"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
