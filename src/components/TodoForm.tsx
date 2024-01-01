/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useTodo } from '../providers/TodoProvider';

export const TodoForm = () => {
  const { todos, setTodos, todosLeft } = useTodo();

  const handleClick = () => {
    const toggle = !!todosLeft;

    setTodos((prev) => {
      return prev.map(todo => ({ ...todo, completed: toggle }));
    });
  };

  return (
    <>
      {!!todos.length && (

        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todosLeft,
          })}
          data-cy="ToggleAllButton"
          onClick={handleClick}
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>

    </>
  );
};
