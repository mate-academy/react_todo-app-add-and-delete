import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  updateTodoComplited,
  // updateTodoTitle,
} from '../../api/todos';

interface Props {
  todos: Todo[] | null;
  showError: (errText: string | boolean) => void;
}
export const Main: React.FC<Props> = ({ todos, showError }) => {
  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
    } catch {
      showError('delete');
    }
  };

  const handleUpdateTodoCompleted = async (
    id: number,
    complitedCurrVal: boolean,
  ) => {
    try {
      await updateTodoComplited(id, {
        completed: !complitedCurrVal,
      // eslint-disable-next-line no-console
      }).then(resp => console.log(resp));
    } catch {
      showError('update');
    }
  };

  // const handleUpdateTodo = () => {

  // };

  return (
    <section className="todoapp__main">
      {todos ? todos.map(({
        title,
        id,
        completed,
      }) => (
        <div key={id} className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => {
                handleUpdateTodoCompleted(
                  id,
                  completed,
                );
              }}
            />
          </label>

          <span className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              handleDeleteTodo(id);
            }}
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )) : (
        <span>Loading...</span>
      )}

      {/* This is a completed todo */}
      <div className="todo completed">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked
          />
        </label>

        <span className="todo__title">Completed Todo</span>

        {/* Remove button appears only on hover */}
        <button type="button" className="todo__remove">×</button>

        {/* overlay will cover the todo while it is being updated */}
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is not completed */}
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span className="todo__title">Not Completed Todo</span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is being edited */}
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button */}
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is in loadind state */}
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">Todo is being saved now</span>
        <button type="button" className="todo__remove">×</button>

        {/* 'is-active' class puts this modal on top of the todo */}
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
