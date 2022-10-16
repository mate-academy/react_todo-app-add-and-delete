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

export const NewTodo: React.FC<Props> = ({
  todos,
  newTodoField,
  handleToggleAllTodos,
  handleSubmit,
  isInterfaceHidden,
  isAdding,
}) => {
  return (
    <header className="NewTodo">
      {!isInterfaceHidden && (
        <button
          aria-label="ToggleAllButton"
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            ({ active: todos.every((todo) => todo.completed) && todos.length }
            ),
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
