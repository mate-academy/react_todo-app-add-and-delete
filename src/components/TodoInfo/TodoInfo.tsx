import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { useState } from 'react';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  loadingTodoIds: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  loadingTodoIds,
}) => {
  const [isTodoLoading, setIsTodoLoading] = useState(false);

  function handleToggleStatus() {
    setIsTodoLoading(true);

    setTimeout(() => {
      setTodos(prevTodos =>
        prevTodos.map(prevTodo =>
          prevTodo.id === todo.id
            ? { ...prevTodo, completed: !prevTodo.completed }
            : prevTodo,
        ),
      );
      setIsTodoLoading(false);
    }, 500);
  }

  function handleDeleteTodo() {
    setIsTodoLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
        );

        setIsTodoLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsTodoLoading(false);
      });
  }

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        htmlFor={`todo-checkbox-${todo.id}`}
        className="todo__status-label"
      >
        <input
          id={`todo-checkbox-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggleStatus}
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
        onClick={handleDeleteTodo}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTodoLoading || loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
