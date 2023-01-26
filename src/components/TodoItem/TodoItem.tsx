import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      {todo.completed
        ? (
          <>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>
          </>
        )

        : (
          <>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={false}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>
          </>
          // <>
          //   <label className="todo__status-label">
          //     <input
          //       data-cy="TodoStatus"
          //       type="checkbox"
          //       className="todo__status"
          //       checked={todo.completed}
          //     />
          //   </label>

      //   <form>
      //     <input
      //       data-cy="TodoTitleField"
      //       type="text"
      //       className="todo__title-field"
      //       placeholder="Empty todo will be deleted"
      //       defaultValue={todo.title}
      //     />
      //   </form>
      // </>
        )}

      <div data-cy="TodoLoader" className="modal overlay">
        {/* is-active */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
