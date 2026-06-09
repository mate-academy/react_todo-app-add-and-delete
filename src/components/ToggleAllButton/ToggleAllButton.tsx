import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

export const ToggleAllButton: React.FC<Props> = ({ todos, setTodos }) => {
  const isAllTodosCompleated = todos.every(todo => todo.completed);

  function handleToggleAllButton() {
    setTodos(
      todos.map(todo => ({ ...todo, completed: !isAllTodosCompleated })),
    );
  }

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isAllTodosCompleated,
      })}
      data-cy="ToggleAllButton"
      onClick={handleToggleAllButton}
    />
  );
};
