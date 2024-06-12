import { useContext } from "react";
import { TodoItem } from "./todo";
import { TodosContext } from "../services/Store";

export const Todos: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(TodosContext);

  return (
    <>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo item-enter-done">
          <label className="todo__status-label">
            <p style={{ display: "none" }}>hidden text</p>

            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <>
            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>
          </>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="has-background-white-ter modal-background" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
