import cn from 'classnames';
import { Todo } from '../types/Todo';
import { handleDeleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: number | null;
  setIsLoading: (e: number | null) => void;
  setErrorMessage: (m: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  setIsLoading,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label htmlFor="status" className="todo__status-label">
            <input
              id="status"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() =>
              handleDeleteTodo(todo, todo.id, setIsLoading, setErrorMessage)
            }
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isLoading === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          <label htmlFor="status-temp" className="todo__status-label">
            <input
              id="status-temp"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
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
      )}
    </section>
  );
};

//  {/* Example: */}
//  <>
//  {/* This is a completed todo */}
//  <div data-cy="Todo" className="todo completed">
//    <label className="todo__status-label">
//      <input
//        data-cy="TodoStatus"
//        type="checkbox"
//        className="todo__status"
//        checked
//      />
//    </label>

//    <span data-cy="TodoTitle" className="todo__title">
//      Completed Todo
//    </span>

//    {/* Remove button appears only on hover */}
//    <button type="button" className="todo__remove" data-cy="TodoDelete">
//      ×
//    </button>

//    {/* overlay will cover the todo while it is being deleted or updated */}
//    <div data-cy="TodoLoader" className="modal overlay">
//      <div className="modal-background has-background-white-ter" />
//      <div className="loader" />
//    </div>
//  </div>

//  {/* This todo is an active todo */}
//  <div data-cy="Todo" className="todo">
//    <label className="todo__status-label">
//      <input
//        data-cy="TodoStatus"
//        type="checkbox"
//        className="todo__status"
//      />
//    </label>

//    <span data-cy="TodoTitle" className="todo__title">
//      Not Completed Todo
//    </span>
//    <button type="button" className="todo__remove" data-cy="TodoDelete">
//      ×
//    </button>

//    <div data-cy="TodoLoader" className="modal overlay">
//      <div className="modal-background has-background-white-ter" />
//      <div className="loader" />
//    </div>
//  </div>

//  {/* This todo is being edited */}
//  <div data-cy="Todo" className="todo">
//    <label className="todo__status-label">
//      <input
//        data-cy="TodoStatus"
//        type="checkbox"
//        className="todo__status"
//      />
//    </label>

//    {/* This form is shown instead of the title and remove button */}
//    <form>
//      <input
//        data-cy="TodoTitleField"
//        type="text"
//        className="todo__title-field"
//        placeholder="Empty todo will be deleted"
//        value="Todo is being edited now"
//      />
//    </form>

//    <div data-cy="TodoLoader" className="modal overlay">
//      <div className="modal-background has-background-white-ter" />
//      <div className="loader" />
//    </div>
//  </div>

//  {/* This todo is in loadind state */}
//  <div data-cy="Todo" className="todo">
//    <label className="todo__status-label">
//      <input
//        data-cy="TodoStatus"
//        type="checkbox"
//        className="todo__status"
//      />
//    </label>

//    <span data-cy="TodoTitle" className="todo__title">
//      Todo is being saved now
//    </span>

//    <button type="button" className="todo__remove" data-cy="TodoDelete">
//      ×
//    </button>

//    {/* 'is-active' class puts this modal on top of the todo */}
//    <div data-cy="TodoLoader" className="modal overlay is-active">
//      <div className="modal-background has-background-white-ter" />
//      <div className="loader" />
//    </div>
//  </div>
// </>
