import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTitle } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setEditableTodoId: (id: number | null) => void,
  onError: (error: ErrorType) => void
};

export const TodoInput: React.FC<Props> = ({
  todo,
  setTodos,
  setEditableTodoId,
  onError: setErrorType,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const submitForm = () => {
    if (todoTitle.trim().length > 0) {
      updateTitle(todo.id, todoTitle)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.map((item: Todo) => {
              if (item.id === todo.id) {
                return {
                  ...item,
                  title: todoTitle,
                };
              }

              return item;
            });
          });
        })
        .catch(() => setErrorType(ErrorType.UPDATE));
    } else {
      deleteTodo(todo.id)
        .then(() => {
          setTodos((prevTodos) => (
            prevTodos.filter((item) => todo.id !== item.id)));
        })
        .catch(() => setErrorType(ErrorType.DELETE));
    }
  };

  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <form onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      >

        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          defaultValue={todo.title}
          onChange={(e) => setTodoTitle(e.target.value)}
          onBlur={() => setEditableTodoId(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submitForm();
              e.target.blur();
            }
          }}
        />
      </form>

      <div className="modal overlay">
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
