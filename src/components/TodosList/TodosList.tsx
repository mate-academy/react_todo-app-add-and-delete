import classnames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  onDelete: (todoId: number) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  onDelete,
}) => {
  const temp = {
    id: 0,
    title,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
          key={temp.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {temp.title}
          </span>
          <div
            data-cy="TodoLoader"
            className={classnames(
              'modal overlay',
              { 'is-active': isAdding },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
