import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (val: number) => void;
  isLoading: number[];
  tempTodo: Todo | null;
  textField: string;
  onStatusChange: (val: Todo) => Promise<void>;
  onEdit: (val: Todo) => Promise<void>;
  isUpdateError: boolean;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  isLoading,
  tempTodo,
  textField,
  onStatusChange,
  onEdit,
  isUpdateError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.length !== 0 && (
        <div>
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              isLoading={isLoading}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              isUpdateError={isUpdateError}
            />
          ))}
        </div>
      )}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {textField}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            {/* eslint-disable-next-line max-len */}
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
