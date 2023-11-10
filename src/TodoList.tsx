/* eslint-disable no-lone-blocks */
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos, deleteTodo, deletingTodoId, isLoading, tempTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleTodos.map((todo) => (
        <div
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : 'active'}`}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            key={todo.id}
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': (deletingTodoId === todo.id && isLoading)
                || (
                  todo.completed && isLoading && !tempTodo && !deletingTodoId
                ),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: tempTodo.completed,
            active: !tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(tempTodo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

// {/* This todo is not completed */}
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Not Completed Todo
//   </span>
//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

// <div data-cy="TodoLoader" className="modal overlay">
//   <div className="modal-background has-background-white-ter" />
//   <div className="loader" />
// </div>

{
  /* This todo is being edited
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {/* This form is shown instead of the title and remove button */
}

{
  /* <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */
}

{
  /* This todo is in loadind state */
}

{
  /* <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        Todo is being saved now
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button> */
}

{
  /* 'is-active' class puts this modal on top of the todo */
}

{
  /* <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */
}
