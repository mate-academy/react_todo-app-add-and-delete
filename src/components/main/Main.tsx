import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';
import { TempTodo } from '../todoItem/TempTodo';
import {
  updateTodoComplited,
  // updateTodoTitle,
} from '../../api/todos';

interface Props {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  showError: (errText: string | boolean) => void;
  handleDeleteTodo: (id: number) => void;
  loading: boolean;
  loadingID: number;
}
export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  showError,
  handleDeleteTodo,
  loading,
  loadingID,
}) => {
  const handleUpdateTodoIsCompleted = async (
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

  return (
    <section className="todoapp__main">
      {todos
      && todos.map(({
        title,
        id,
        completed,
      }) => (
        <TodoItem
          loading={loading}
          loadingID={loadingID}
          key={id}
          title={title}
          id={id}
          completed={completed}
          onDelete={handleDeleteTodo}
          onIsComplitedUpdate={handleUpdateTodoIsCompleted}
        />
      ))}
      {tempTodo
      && <TempTodo tempTodo={tempTodo} />}

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
    </section>
  );
};
