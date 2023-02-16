import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todoId: number) => void;
  todoIdsToDelete: number[];
};
export const TodoItem: React.FC<Props> = (
  {
    todo,
    handleDeleteTodo,
    todoIdsToDelete,
  },
) => {
  const [todoId, setTodoId] = useState(0);

  const handleDeletion = (id: number) => {
    handleDeleteTodo(id);
    setTodoId(id);
  };

  return (
    <div
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          // placeholder="Empty todo will be deleted"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/*   /!* This form is shown instead of the title and remove button *!/ */}
      {/*   <form> */}
      {/*     <input */}
      {/*       type="text" */}
      {/*       className="todo__title-field" */}
      {/*       placeholder="Empty todo will be deleted" */}
      {/*       value="Todo is being edited now" */}
      {/*     /> */}
      {/*   </form> */}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          if (todo.id) {
            handleDeletion(todo.id);
          }
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      {/*   /!* 'is-active' class puts this modal on top of the todo *!/ */}
      <div
        className={cn(
          'modal overlay',
          {
            'is-active': todoId === todo.id
              || todoIdsToDelete.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
