import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  setTodoList: (todos: Todo[]) => void;
  todo: Todo;
  todos: Todo[];
  setErrorMessage: (value: string) => void;
  deletedTodos: number[];
  setDeletedTodos: (value: number[]) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  setTodoList,
  todos,
  setErrorMessage,
  deletedTodos,
  setDeletedTodos,
}) => {
  const { title, id } = todo;

  const handleDeleteTodo = async (value: number) => {
    try {
      setDeletedTodos([id]);
      const newTodos = todos.filter((x) => x.id !== value);

      await deleteTodo(`/todos/${value}`);

      setTodoList(newTodos);
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletedTodos([]);
    }
  };

  return (
    <>
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {deletedTodos.includes(id) && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </>
  );
};
