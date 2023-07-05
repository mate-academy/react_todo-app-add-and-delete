import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeletingTodo: (todoId: number) => void;
  isLoading: boolean;
  deletedTodoId: number[];
}

export const TodoApp: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeletingTodo,
  isLoading,
  deletedTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div className={classNames('todo', { completed: todo.completed })}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeletingTodo(todo.id)}
          >
            ×
          </button>

          <div className={classNames(
            'modal overlay',
            { 'is-active': isLoading && deletedTodoId.includes(todo.id) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && <TodoItem tempTodo={tempTodo} /> }
    </section>
  );
};
