/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

type Props = {
  todos: Todo[];
  setPreparedTodos: (e: Todo[]) => void;
  tempTodo: Todo | null;
  isLoading: number[];
  setIsLoading: (e: (s: number[]) => number[] | number[]) => void;
  setErrorMessage: (m: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setPreparedTodos,
  tempTodo,
  isLoading,
  setIsLoading,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todos={todos}
          todo={todo}
          setPreparedTodos={setPreparedTodos}
          key={todo.id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setErrorMessage={setErrorMessage}
        />
      ))}

      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          <label htmlFor="status-temp" className="todo__status-label">
            <input
              id="status-temp"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
