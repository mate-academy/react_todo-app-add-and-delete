import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  todo: Todo
  setTodos: (toggle: Todo[]) => void
  deleted: () => void
  loadingTodosIds: number[]
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleted,
  todos,
  setTodos,
  loadingTodosIds,
}) => {
  const loaded = loadingTodosIds.includes(todo.id);
  const toggleTodo = (id: number) => {
    const toggle = todos.map(todoItem => (todoItem.id === id
      ? { ...todoItem, completed: !todoItem.completed } : todoItem));

    setTodos(toggle);
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => toggleTodo(todo.id)}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={deleted}
      >
        ×
      </button>

      <div className={cn('modal overlay', { 'is-active': loaded })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
