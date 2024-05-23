/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { memo, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { Todo as TodoType } from '../../types/Todo';
import { deleteTodo, getTodos } from '../../api/todos';

type TodoProps = {
  todo: TodoType;
};

export const Todo: React.FC<TodoProps> = memo(({ todo }) => {
  const { state, dispatch } = useContext(AppContext);
  const { targetTodo, todoDeleteDisabled } = state;

  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editRef.current) {
      editRef.current.focus();
    }
  }, []);

  // TODO avoid duplication vs footer?
  const handleDelete = async (todoId: number) => {
    dispatch({
      type: 'SET_TODO_DISABLED',
      payload: {
        value: true,
        targetId: todoId,
      },
    });
    dispatch({ type: 'DELETE_TODO', payload: todoId });

    try {
      await deleteTodo(todoId);

      dispatch({ type: 'LOAD_TODOS_FROM_SERVER', payload: await getTodos() });
    } catch (error) {
      dispatch({
        type: 'UPDATE_ERROR_STATUS',
        payload: { type: 'DeleteTodoError' },
      });
      throw error;
    } finally {
      dispatch({
        type: 'SET_TODO_DISABLED',
        payload: {
          value: false,
          targetId: todoId,
        },
      });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          // onchange on page and server?
        />
      </label>

      {targetTodo === todo.id ? (
        <form>
          <input
            ref={editRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todoDeleteDisabled.targetId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

Todo.displayName = 'Todo';
