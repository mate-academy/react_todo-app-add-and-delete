import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todoId: number;
  todoTitle: string;
  isCompleted: boolean;
  handleTodoClick: (id: number) => void;
  deleteTodos: (id: number) => void;
  isSubmitting: Todo | null;
  deletingTodo: number;
  currentTodos: number[];
}

export const TodoItem: React.FC<Props> = ({
  todoId,
  todoTitle,
  isCompleted,
  handleTodoClick,
  deleteTodos,
  isSubmitting,
  deletingTodo,
  currentTodos,
}) => {
  const id = currentTodos.find(currentId => currentId === todoId);
  const handleChange =
    isSubmitting?.id === todoId || deletingTodo === todoId || id;

  return (
    <div
      key={todoId}
      data-cy="Todo"
      className={cn('todo', { completed: isCompleted })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo-${todoId}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-${todoId}`}
          checked={isCompleted}
          onChange={() => handleTodoClick(todoId)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todoTitle}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodos(todoId)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': handleChange,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
