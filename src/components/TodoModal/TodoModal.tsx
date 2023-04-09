import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import './TodoModal.scss';
import { DeleteTodo } from '../DeleteTodo/DeleteTodo';

interface Props {
  todo: Todo;
  isBeingEdited: boolean;
  deleteTodo: (todoId: number) => void;
}

export const TodoModal: React.FC<Props> = ({
  todo,
  deleteTodo,
  isBeingEdited,
}) => {
  const { completed, title } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" checked={completed} />
      </label>

      <span className="todo__title">{title}</span>

      <DeleteTodo todoId={todo.id} onDelete={() => deleteTodo(todo.id)} />

      <div
        className={classNames('modal overlay', { 'is-active': isBeingEdited })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
