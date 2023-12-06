import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { DispatchContext, StateContext } from './TodosProvider';
import { deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo,
};

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const {
    completed,
    id,
    title,
    userId,
  } = todo;

  const { todos, deleteCompleted } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(!todos.find(t => t.id === id));

  const switchChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'updateTodo',
      payload: {
        id,
        title,
        completed: e.target.checked,
        userId,
      },
    });
  };

  const deleteCurrentTodo = async () => {
    setIsLoading(true);
    try {
      await deleteTodo(id);

      dispatch({
        type: 'deleteTodo',
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: 'error',
        payload: ErrorMessage.Deleting,
      });
    }
  };

  useEffect(() => {
    if (deleteCompleted && completed) {
      setIsLoading(true);
    }
  }, [deleteCompleted, completed]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={switchChecked}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={deleteCurrentTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
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
  );
};
