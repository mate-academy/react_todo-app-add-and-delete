import { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';
import { deleteTodos } from '../api/todos';
import { Error } from '../types/Error';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todos, setTodos, setErrorMessage } = useContext(TodosContext);

  const handleTodoDelete = () => {
    deleteTodos(todo.id.toString())
      .then(() => setTodos(todos.filter(item => item.id !== todo.id)))
      .catch(() => setErrorMessage(Error.delete));
  };

  const handleTodoCheck = () => {
    setTodos(todos.map(item => {
      return item.id === todo.id
        ? { ...item, completed: !item.completed }
        : item;
    }));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={handleTodoCheck}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': !todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
