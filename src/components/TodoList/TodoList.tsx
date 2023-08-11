import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[]
  todos: Todo[]
  setTodos:(toggle: Todo[]) => void
  deleted:(postId: number) => void
  tempTodo: Todo | null
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleted,
  todos,
  setTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleted={() => deleted(todo.id)}
          todos={todos}
          setTodos={setTodos}
        />
      ))}
      {tempTodo !== null && (
        <div className="todo">
          <label className="todo__status">
            <input
              type="checkbox"
              className="todo__status-loader"
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
