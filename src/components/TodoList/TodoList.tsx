import cn from "classnames";
import { TodosContext } from "../../components/TodosProvider";
import { useContext, useState } from "react";
import { Todo } from "../../types/Todo";

export const TodoList: React.FC = () => {
  const [editTodo, setEditTodo] = useState<Todo>();
  const [newTodo, setNewTodo] = useState("");

  const { filteredTodos, deleteTodoHandler, updateTodoHandler } =
    useContext(TodosContext);

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement>,
    todo: Todo
  ) => {
    console.log(event.detail);
    switch (event.detail) {
      case 2: {
        console.log("double click");
        setEditTodo(todo);
        setNewTodo(todo.title);
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter' && editTodo?.id) {
      updateTodoHandler({
        id: editTodo.id,
        userId: editTodo.userId,
        title: newTodo,
        completed: editTodo.completed,
      })
      setNewTodo('');
    }
  }

  console.log("TODO LIST", filteredTodos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <div
          data-cy="Todo"
          className={cn("todo", {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() =>
                updateTodoHandler({
                  id: todo.id,
                  userId: todo.userId,
                  title: todo.title,
                  completed: !todo.completed,
                })
              }
            />
          </label>

          {todo === editTodo ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onClick={(event) => handleDoubleClick(event, todo)}
              >
                {todo.title}
              </span>
              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodoHandler(todo)}
              >
                ×
              </button>{" "}
            </>
          )}

          {/* overlay will cover the todo while it is being updated */}
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
