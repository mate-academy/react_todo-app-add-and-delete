import { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo [],
  tempTodo: Todo | null,
  onDeleteTodo: (id: number) => void,
  loadingTodosIds: number [],
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  onDeleteTodo,
  loadingTodosIds,
}) => (
  <section
    className="todoapp__main"
    data-cy="TodoList"
  >
    {todos.map((todo) => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        loadingTodosIds={loadingTodosIds}
      />
    ))}

    {tempTodo
      && (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed === true,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className="modal overlay is-active"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
  </section>
));
