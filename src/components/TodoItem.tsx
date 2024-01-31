import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodos } from '../hooks/useTodos';
import * as postService from '../api/todos';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setErrorMessage } = useTodos();

  const [isLoading, setIsLoading] = useState(false);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);

    postService.deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodos => {
          if (prevTodos) {
            return prevTodos.filter(currentTodo => currentTodo.id !== todoId);
          }

          return prevTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

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

  //   <div data-cy="TodoLoader" className="modal overlay">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>

  // {/* This todo is being edited */}
  // <div data-cy="Todo" className="todo">
  //   <label className="todo__status-label">
  //     <input
  //       data-cy="TodoStatus"
  //       type="checkbox"
  //       className="todo__status"
  //     />
  //   </label>

  //   {/* This form is shown instead of the title and remove button */}
  //   <form>
  //     <input
  //       data-cy="TodoTitleField"
  //       type="text"
  //       className="todo__title-field"
  //       placeholder="Empty todo will be deleted"
  //       value="Todo is being edited now"
  //     />
  //   </form>

  //   <div data-cy="TodoLoader" className="modal overlay">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>

  // {/* This todo is in loadind state */}
  // <div data-cy="Todo" className="todo">
  //   <label className="todo__status-label">
  //     <input
  //       data-cy="TodoStatus"
  //       type="checkbox"
  //       className="todo__status"
  //     />
  //   </label>

  //   <span data-cy="TodoTitle" className="todo__title">
  //     Todo is being saved now
  //   </span>

  //   <button type="button" className="todo__remove" data-cy="TodoDelete">
  //     ×
  //   </button>

  //   {/* 'is-active' class puts this modal on top of the todo */}
  //   <div data-cy="TodoLoader" className="modal overlay is-active">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>
  );
};
