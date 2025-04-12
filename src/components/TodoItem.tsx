import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  activeTodoIds: number[];
  setActiveTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoItem = ({
  todo,
  activeTodoIds,
  setTodos,
  setActiveTodoIds,
  setError,
  inputRef,
}: Props) => {
  const { id, title, completed } = todo;
  const isLoading = activeTodoIds.includes(id);

  const handleDelete = (todoId: number) => {
    setActiveTodoIds(current => [...current, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(todos =>
          todos.filter(deletedTodo => deletedTodo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setActiveTodoIds(current =>
          current.filter(activeId => activeId !== todoId),
        );
        inputRef.current?.focus();
      });
  };

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
