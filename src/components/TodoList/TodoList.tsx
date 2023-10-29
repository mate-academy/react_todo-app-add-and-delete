import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type ListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
};

export const List: React.FC<ListProps> = (
  { todos, tempTodo, handleDelete },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map((todo) => {
        return (
          <TodoItem todo={todo} handleDelete={handleDelete} />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} handleDelete={handleDelete} />}
      {/* This form is shown instead of the title and remove button /}
      {/ <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todotitle-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> /}
      {/ This todo is in loadind state /}
      {/ <div data-cy="Todo" className="todo">
        <label className="todostatus-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todostatus"
          />
        </label>
        <span data-cy="TodoTitle" className="todotitle">
          Todo is being saved now
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button> /}
      {/ 'is-active' class puts this modal on top of the todo /}
      {/ <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
