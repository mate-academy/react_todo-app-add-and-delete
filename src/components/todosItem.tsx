/* eslint-disable jsx-a11y/label-has-associated-control */

import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodosContext } from './todosContext';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface ItemProps {
  item: Todo;
}

export const TodosItem: React.FC<ItemProps> = ({ item }) => {
  const { todos, setTodos, handleDeleteTodo } = useContext(TodosContext);
  const { allId } = useContext(TodosContext);

  const changePersonalComplete = () => {
    return todos.map(elem => {
      if (elem.id === item.id) {
        return {
          ...elem,
          completed: !item.completed,
        };
      }

      return elem;
    });
  };

  const isTodoCompletedClass = classNames({
    todo: true,
    completed: item.completed,
  });

  const loaderClass = classNames({
    modal: true,
    overlay: true,
    'is-active': allId.includes(item.id) || !item.id,
  });

  return (
    <>
      <div data-cy="Todo" className={isTodoCompletedClass}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() => setTodos(changePersonalComplete())}
            checked={item.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {item.title}
        </span>

        <button
          onClick={() => handleDeleteTodo(item.id)}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div data-cy="TodoLoader" className={loaderClass}>
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
