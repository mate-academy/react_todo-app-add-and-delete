/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  filteredTodos: Todo[];
  updatingTodosId: number[];
  onDeleteTodo: (id: number) => Promise<void>;
};

export const Main: React.FC<Props> = ({
  todosLength,
  filteredTodos,
  updatingTodosId,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!!todosLength &&
        filteredTodos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', todo.completed && 'completed')}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {}}
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              onClick={() => {
                onDeleteTodo(todo.id);
              }}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={cn(
                'modal',
                'overlay',
                updatingTodosId.includes(todo.id) && 'is-active',
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
    </section>
  );
};
