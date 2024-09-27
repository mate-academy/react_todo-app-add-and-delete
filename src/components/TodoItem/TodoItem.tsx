import { useContext, useState } from 'react';
import cl from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Context } from '../constext';
import '../../styles/todo.scss';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { notifyError, setTodos, forRemove, setForRemove } =
    useContext(Context);

  const [isUpdate, setIsUpdate] = useState(false);
  const [hasLoader, setHasLoader] = useState(() => {
    if (!todo.id) {
      return true;
    }

    return false;
  });
  const [value, setValue] = useState(todo.title);

  const removeTodo = () => {
    if (hasLoader) {
      return null;
    }

    setHasLoader(true);

    return deleteTodo(todo.id)
      .then(() => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1);

          return newTodos;
        });
      })
      .catch(() => {
        notifyError('Unable to delete a todo');
      })
      .finally(() => setHasLoader(false));
  };

  if (forRemove.includes(todo.id)) {
    removeTodo()?.then(() => {
      setForRemove(prevForRemove => {
        const newForRemove = [...prevForRemove];
        const index = newForRemove.indexOf(todo.id);

        newForRemove.splice(index, 1);

        return newForRemove;
      });
    });
  }

  const updateTodo = () => {
    // update

    setIsUpdate(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsUpdate(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdate(false);
  };

  const complet = () => {};

  return (
    <div data-cy="Todo" className={cl('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={complet}
        />
      </label>

      {!isUpdate ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={handleChange}
            onBlur={updateTodo}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cl('modal', 'overlay', { 'is-active': hasLoader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
