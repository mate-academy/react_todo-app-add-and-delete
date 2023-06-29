import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodoCheck } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todo: Todo,
  onError: (error: ErrorType) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onEditId: (id: number) => void,
};

export const LoadedTodo: React.FC<Props> = ({
  todo,
  onError: setErrorType,
  setTodos,
  onEditId: setEditableTodoId,
}) => {
  const updateCheck = (todoToUpdate: Todo) => {
    updateTodoCheck(todoToUpdate.id, !todoToUpdate.completed)
      .then(() => {
        setTodos((prevTodos) => prevTodos.map((currentTodo) => {
          if (currentTodo.id === todo.id) {
            return {
              ...currentTodo,
              completed: !todo.completed,
            };
          }

          return currentTodo;
        }));
      })
      .catch(() => {
        setErrorType(ErrorType.UPDATE);
      });
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => {
        setEditableTodoId(todo.id);
      }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => updateCheck(todo)}
        />
      </label>
      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          deleteTodo(todo.id)
            .then(() => {
              setTodos((prevTodos) => (
                prevTodos.filter((item) => todo.id !== item.id)));
            })
            .catch(() => setErrorType(ErrorType.DELETE));
        }}
      >
        ×
      </button>

      <div className="modal overlay">
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
