import cn from 'classnames';
import { Todo } from '../types/Todo';
// import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  handleDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, handleDelete }) => (
  <>
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      {/* <TodoLoader /> */}
    </div>

    {/* This todo is being edited
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      This form is shown instead of the title and remove button
      <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>

      <TodoLoader />
    </div>

    This todo is in loadind state
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        Todo is being saved now
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      'is-active' class puts this modal on top of the todo
      <TodoLoader />
    </div> */}
  </>
);
