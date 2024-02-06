import classNames from 'classnames';
import { useContext } from 'react';
import { ErrorMessage, Todo } from '../../types';
import { ContextTodo } from '../ContextTodo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const ItemTodo: React.FC<Props> = ({ todo }) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const {
    setTodos,
    setErrorMessage,
    updatedTodos,
    setUpdatedTodos,
  } = useContext(ContextTodo);

  const changeHandler = () => {
    setTodos(currentTodos => currentTodos
      .map(currentTodo => (currentTodo.id === id
        ? ({ ...currentTodo, completed: !completed })
        : currentTodo)));

    updateTodo(todo.id, !completed);
  };

  const clickHandler = () => {
    setUpdatedTodos(currentTodos => [...currentTodos, todo]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== id));
      })
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodoError))
      .finally(() => setUpdatedTodos([]));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', { completed })}
          checked={completed}
          onChange={changeHandler}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        onClick={clickHandler}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': updatedTodos.includes(todo) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
