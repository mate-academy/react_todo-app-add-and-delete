/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface ToDoItemProps {
  tempTodo: Todo;
}
const TempTodo: React.FC<ToDoItemProps> = ({ tempTodo }) => (
  <div
    key={tempTodo.id}
    data-cy="Todo"
    className={classNames('todo', { completed: tempTodo.completed })}
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
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);

export default TempTodo;
