import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  title: string,
  onDelete: (todoId: number) => void,
  deletingTodoId: number,
  completedTodosId: number[],
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  isAdding,
  title,
  onDelete,
  deletingTodoId,
  completedTodosId,
}) => {
  return (
    <>
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={
            completedTodosId.includes(todo.id) || deletingTodoId === todo.id
          }
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
});
