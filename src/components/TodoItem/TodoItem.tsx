import { useContext, useState } from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';

import { TodoContext } from '../../context/TodoContext';

type Props = {
  todo: Todo;
  tempLoader?: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, tempLoader }) => {
  const [currentTodoIds, setCurrentTodoIds] = useState<number[]>([]);

  const { deleteTodo, deletedTodos } = useContext(TodoContext);

  const handleDeleteTodos = async (deletedTodo: Todo) => {
    setCurrentTodoIds(todoIds => [...todoIds, deletedTodo.id]);

    await deleteTodo(todo.id);

    setCurrentTodoIds([]);
  };

  const isShowModal = currentTodoIds.includes(todo.id)
    || (deletedTodos?.includes(todo))
    || tempLoader;

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {true ? (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodos(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      {isShowModal && (
        <div className={classNames('modal overlay', {
          'is-active': isShowModal,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
