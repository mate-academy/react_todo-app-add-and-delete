import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  todoId: number;
  setTodoId: (id: number) => void;
  setTodos: (todo: Todo[]) => void;
  setErrorNotification: (value: string) => void;
  isShownTempTodo: boolean;
  previewTitle: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoId,
  setTodos,
  setTodoId,
  setErrorNotification,
  isShownTempTodo,
  previewTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      { todos.map(({ title, completed, id }) => (
        <TodoItem
          title={title}
          completed={completed}
          id={id}
          key={id}
          setErrorNotification={setErrorNotification}
          setTodos={setTodos}
          todos={todos}
          todoId={todoId}
          setTodoId={setTodoId}
        />
      ))}

      {isShownTempTodo
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
              {previewTitle}
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
