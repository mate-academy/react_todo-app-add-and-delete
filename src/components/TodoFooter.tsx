/* eslint-disable quote-props */
import cn from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  numberOfActiveTodos: number,
  numberOfCompletedTodos: number,
  onStatusChange: React.Dispatch<React.SetStateAction<Status>>,
  status: Status,
  onDeleteTodo: (todoId: number) => void,
  todos: Todo[],
};

export const TodoFooter: React.FC<Props> = ({
  numberOfActiveTodos,
  numberOfCompletedTodos,
  onStatusChange,
  status,
  onDeleteTodo,
  todos,
}) => {
  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDeleteTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {numberOfActiveTodos}
        {' '}
        items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { 'selected': status === Status.all },
          )}
          onClick={() => onStatusChange(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { 'selected': status === Status.active },
          )}
          defaultValue={Status.active}
          onClick={() => onStatusChange(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { 'selected': status === Status.completed },
          )}
          defaultValue={Status.completed}
          onClick={() => onStatusChange(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {numberOfCompletedTodos !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
