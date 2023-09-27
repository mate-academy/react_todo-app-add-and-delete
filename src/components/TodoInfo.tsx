import { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type TodoInfoProps = {
  todo: Todo;
};

export const TodoInfo = ({ todo }: TodoInfoProps) => {
  const { deleteTodo: deleteTodoLocaly } = useContext(TodosContext);

  const handleDelete = () => {
    deleteTodo(todo.id);
    deleteTodoLocaly(todo.id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
        completed: !!todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          title="todoInput"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
        {/* {console.log(todo.title)} */}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className="modal overlay"
        // className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
