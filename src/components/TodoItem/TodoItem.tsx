import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemoveTodo: (id: number) => void,
  selectedTodos: number[],
  setSelectedTodos: (num: number[]) => void,
  onUpdate: (todoId: number, data: Partial<Todo>) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  selectedTodos,
  setSelectedTodos,
  onUpdate,
}) => {
  const handleRemove = () => {
    onRemoveTodo(todo.id);
    setSelectedTodos([todo.id]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
          defaultChecked
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemove}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': selectedTodos.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
