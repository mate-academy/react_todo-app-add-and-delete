import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';


type Props = {
  todoItem: Todo;
  handleClickDelete: (id: number)=> void;
  filteredTodos: Todo[];
};

export const TodoItem: React.FC<Props> = ({ todoItem, handleClickDelete, filteredTodos }) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const handleDelete = (todoId: number) => {
    setDeletedId(todoId);
    deleteTodo(todoId);
  };

  //const selectTodo = filteredTodos.find(todo => todo.id === todoItem.id);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          'todo completed': todoItem.completed,
        },
      )}

    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todoItem.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={()=>handleClickDelete(todoItem.id)}
      >
        ×
      </button>

      {deletedId !== todoItem.id &&
      <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
      }

    </div>
  );
};
