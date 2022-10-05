import { Todo } from '../types/Todo';
import { TodoInfo } from './Todo';

interface Props {
  todos: Todo[];
  setError: (value: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  isLoading: boolean,
  setSelectedTodoId: (value: number) => void,
  selectedTodoId: number | null,
  tempTitle: string
}

export const TodoList: React.FC<Props> = ({
  todos,
  setError,
  setTodos,
  isLoading,
  setSelectedTodoId,
  selectedTodoId,
  tempTitle,
}) => {
  const temp = {
    id: 0,
    title: tempTitle,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, completed, title }) => (
        <TodoInfo
          key={id}
          title={title}
          completed={completed}
          id={id}
          setError={setError}
          setTodos={setTodos}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
        />
      ))}
      {isLoading
        && (
          <div
            data-cy="Todo"
            className="todo"
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {temp.title}
            </span>
            <div
              data-cy="TodoLoader"
              className="modal overlay is-active"
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </section>
  );
};
