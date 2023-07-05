import { useState } from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './utils/TodoItem';

interface TodoListProps {
  todos: Todo[];
  setRemoveTodoIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTodoIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  setRemoveTodoIsClicked,
  setEditTodoIsClicked,
  tempTodo,
  setTodos,
}) => {
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const remove = (url: string) => {
    return fetch(url, {
      method: 'DELETE',
    });
  };

  const deleteTodo = (todoId: number) => {
    return remove(`https://mate.academy/students-api/todos/${todoId}`);
  };

  const handleTodoRemoval = async (todoId: number) => {
    setItemToDelete(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
      setItemToDelete(null);
    } catch {
      setRemoveTodoIsClicked(true);
    }
  };

  const handleTodoTitleChange = () => {
    setEditTodoIsClicked(true);
  };

  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDoubleClick={handleTodoTitleChange}
          onClick={handleTodoRemoval}
          isLoading={todo.id === itemToDelete}
        />

      ))}

      {tempTodo
          && (
            <TodoItem
              todo={tempTodo}
              isLoading
            />
          )}

      {/* This todo is not completed */}

      {/* This todo is being edited */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
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
      </div> */}

      {/* This todo is in loadind state */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">Todo is being saved now</span>
        <button type="button" className="todo__remove">×</button> */}

      {/* 'is-active' class puts this modal on top of the todo */}
      {/* <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div> */}
      {/* </div> */}
    </section>
  );
};
