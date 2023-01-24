import { Todo } from '../../types/Todo';
import { TodoCard } from '../Todo/Todo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  tempTodo: Todo | null,
  onDelete: (todoId: number) => void,
  deletingTodoId: number,
  isClearCompleted: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos, isAdding, tempTodo, onDelete, deletingTodoId, isClearCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletingTodoId={deletingTodoId}
          isClearCompleted={isClearCompleted}
        />
      ))}
      {isAdding && tempTodo && (
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

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
