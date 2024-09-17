/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoInfo } from './TodoInfo';
import { Todo } from './types/Todo';

type Props = {
  isLoading: boolean;
  todos: Todo[];
  onDelete?: (id: number) => void;
  tempTodo?: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  isLoading,
  todos,
  onDelete = () => {},
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            isLoading={isLoading}
            onDelete={onDelete}
            key={todo.id}
            todo={todo}
          />
        );
      })}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
