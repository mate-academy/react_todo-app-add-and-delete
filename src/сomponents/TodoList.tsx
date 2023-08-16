import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  todosIdToDelete: number[];
  setTodosIdToDelete: (todosId: number[]) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todosIdToDelete,
  setTodosIdToDelete,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todosIdToDelete={todosIdToDelete}
          setTodosIdToDelete={setTodosIdToDelete}
        />
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="Loader">
              <div className="Loader__content" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
