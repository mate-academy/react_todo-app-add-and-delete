import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
  loadingIds?: number[];
  tempTodo?: Todo | null;
};

const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  loadingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodoHandler={deleteTodo}
          loadingIds={loadingIds}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="temp-todo">
            {'  '}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              id="temp-todo"
              className="todo__status"
              checked={false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

export default TodoList;
