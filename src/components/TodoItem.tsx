import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => Promise<void>,
  isDeleting:boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isDeleting,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  const onDeleteTodo = () => {
    setSelectedTodoId(id);

    removeTodo(id).catch(() => setSelectedTodoId(0));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        {
          completed,
        })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={onDeleteTodo}
      >
        ×
      </button>

      {(id === 0
      || selectedTodoId
      || (isDeleting && completed)) && (
        <TodoLoader />
      )}

    </div>
  );
};
