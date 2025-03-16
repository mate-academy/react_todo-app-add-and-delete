import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (arg: Todo[]) => void;
  allTodos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
  loadingTodo: boolean;
  setErrorMessage: (arg: string) => void;
  setLoadingTodo: (arg: boolean) => void;
  loadingTodoId: number;
  setLoadingTodoId: (arg: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, id, completed },
  todos,
  setTodos,
  allTodos,
  setAllTodos,
  loadingTodo,
  setErrorMessage,
  setLoadingTodo,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  //#region handle functions
  const handleDeleteButton = (todoId: number) => {
    setLoadingTodo(true);
    setLoadingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        const filtered = allTodos.filter(todoItem => todoItem.id !== todoId);

        setTodos([...filtered]);
        setAllTodos([...filtered]);
        setLoadingTodo(false);
        setLoadingTodoId(-1);
      })
      .catch(() => setErrorMessage(`Unable to delete a todo`));
  };

  const handleToggleTodo = () => {
    const updatedTodos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );

    setTodos(updatedTodos);
    setAllTodos(updatedTodos);
  };
  //#endregion

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label" aria-label="toggle todo completion">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status')}
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteButton(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodo && id === loadingTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
