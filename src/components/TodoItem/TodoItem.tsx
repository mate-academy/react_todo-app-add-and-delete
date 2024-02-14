import cn from 'classnames';
import {
  useContext,
  useState,
} from 'react';
import { deleteTodos } from '../../api/todos';
import { TodoContext } from '../State/TodoContext';

type Props = {
  completed: boolean
  id: number
  title: string
};

export const TodoItem: React.FC<Props> = ({
  completed,
  id,
  title,
}) => {
  const [handleDeleteTodoId, setHandleDeleteTodoId] = useState(0);

  const {
    setTodos,
    setIsError,
    setErrorText,
  } = useContext(TodoContext);

  const handleCheckTodo = (idTodo: number) => {
    setTodos(prevTodos => prevTodos.map(todo => (
      todo.id === idTodo ? { ...todo, completed: !todo.completed } : todo)));
  };

  const handleDeleteTodo = (idTodo: number) => {
    setHandleDeleteTodoId(idTodo);

    deleteTodos(idTodo)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== idTodo));
      })
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to delete a todo');
      });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })} key={id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCheckTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': id === 0 || handleDeleteTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
