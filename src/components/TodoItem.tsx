import classNames from 'classnames';
import { useTodoContext } from '../hooks/useTodoContext';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onProcessed: boolean,
};

const TodoItem = ({ todo, onProcessed }: Props) => {
  const {
    onDeleteTodo,
  } = useTodoContext();

  const handleDeleteTodo = (todoId: number) => {
    onDeleteTodo(todoId);
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': onProcessed,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
