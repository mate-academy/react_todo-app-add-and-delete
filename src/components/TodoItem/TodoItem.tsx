import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  completedTodos: Todo[];
  addTodo: (todoId: number) => void;
  removeTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    completedTodos,
    addTodo,
    removeTodo,
  } = props;
  const { id, title, completed } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleChangeStatus = (todoId: number) => {
    setIsCompleted(prevStatus => !prevStatus);

    if (completedTodos.includes(todo)) {
      removeTodo(todoId);
      todo.completed = false;
    } else {
      addTodo(todoId);
      todo.completed = true;
    }
  };

  return (
    <div className={classNames(
      'todo',
      {
        completed: isCompleted,
      },
    )}
    >
      <label
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => handleChangeStatus(id)}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
