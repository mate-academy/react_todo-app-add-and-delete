import React, { useCallback, useContext, useRef } from 'react';
import cn from 'classnames';

import './TodoItem.scss';

import * as todoService from '../../../api/todos';

import { DispatchContext, StateContext, actionCreator } from '../../TodoStore';
import { TodoError } from '../../../types/TodoError';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const {
    isSubmitting,
    isDeleting,
    isClearing,
    selectedFilter,
  } = useContext(StateContext);

  const deletableTodoId = useRef(0);
  const isDeletingLoader = (isClearing && todo.completed)
    || (isDeleting && deletableTodoId.current === todo.id)
    || (isSubmitting && deletableTodoId.current === todo.id);

  const deleteTodo = useCallback(() => {
    deletableTodoId.current = todo.id;
    dispatch(actionCreator.toggleDeleting());
    dispatch(actionCreator.clearError());
    todoService.deleteTodo(todo.id)
      .then(() => {
        dispatch(actionCreator.updateTodos({
          delete: todo.id, filter: selectedFilter,
        }));
      })
      .catch(error => {
        dispatch(actionCreator.addError(TodoError.ErrorDelete));
        throw error;
      })
      .finally(() => dispatch(actionCreator.toggleDeleting()));
  }, [selectedFilter, todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
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
        onClick={deleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeletingLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  //   {/* This todo is being edited */}
  //   <div data-cy="Todo" className="todo">
  //     <label className="todo__status-label">
  //       <input
  //         data-cy="TodoStatus"
  //         type="checkbox"
  //         className="todo__status"
  //       />
  //     </label>

  //     {/* This form is shown instead of the title and remove button */}
  //     <form>
  //       <input
  //         data-cy="TodoTitleField"
  //         type="text"
  //         className="todo__title-field"
  //         placeholder="Empty todo will be deleted"
  //         value="Todo is being edited now"
  //       />
  //     </form>

  //     <div data-cy="TodoLoader" className="modal overlay">
  //       <div className="modal-background has-background-white-ter" />
  //       <div className="loader" />
  //     </div>
  //   </div>
  );
};
