import classNames from 'classnames';
import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';

interface Props {
  todoItem: Todo,
}

export const TodoItem: React.FC<Props> = ({ todoItem }) => {
  const { id, title, completed } = todoItem;
  const { setIsLoading } = useContext(TodosContext);
  const { deleteTodo } = useContext(TodoUpdateContext);

  async function handleDelete() {
    setIsLoading(true);

    try {
      await deleteTodo(id);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* This todo is not completed */}
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>

        <TodoLoader id={id} />
      </div>
    </>
  );
};
