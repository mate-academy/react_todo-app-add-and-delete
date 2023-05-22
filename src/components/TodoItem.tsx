import { useState, useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';

type Props = {
  todo: Todo;
  isCreating?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isCreating,
}) => {
  const { todos, setTodos, setError } = useContext(TodoContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleDelete = (id: number) => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter((currentTodo) => currentTodo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          value={todo.title}
          checked={todo.completed}
          onChange={() => setIsEditing(true)}
        />
      </label>
      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading || isCreating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
