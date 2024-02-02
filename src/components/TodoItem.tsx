import { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todo: Todo,
  isTemp?: boolean,
}

export const TodoItem: React.FC<Props> = ({ todo, isTemp = false }) => {
  const { setErrorMessage, setTodos } = useContext(TodoContext);
  const handleCatch = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => setTodos(prevTodos => prevTodos
        .filter(todoToFilter => todoToFilter.id !== todoId)))
      .catch(() => setErrorMessage(ErrorMessage.failedLoad))
      .finally(() => handleCatch());
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => { }}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isTemp })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
