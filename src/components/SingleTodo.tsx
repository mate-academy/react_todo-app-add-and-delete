import {
  FC, useContext, useEffect, useMemo,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types';
import { AppContext } from '../context/AppContext';
import { removeTodo } from '../api/todos';

type Props = {
  todo: Todo,
};

export const SingleTodo: FC<Props> = ({ todo }) => {
  const {
    tempTodo,
    loadData,
    setErrorMessage,
    setShowError,
    todosBeingoLoaded,
    setTodosBeingoLoaded,
  } = useContext(AppContext);

  const handleTodoRemove = async () => {
    setTodosBeingoLoaded(prev => ([
      ...prev,
      todo.id,
    ]));

    try {
      await removeTodo(todo.id);
      await loadData();
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setShowError(true);
    } finally {
      setTodosBeingoLoaded(prev => prev.filter(id => id === todo.id));
    }
  };

  useEffect(() => {
    if (tempTodo?.id === todo.id) {
      setTodosBeingoLoaded(prev => ([
        ...prev,
        todo.id,
      ]));
    }
  }, [setTodosBeingoLoaded, tempTodo?.id, todo.id]);

  const isLoading = useMemo(() => {
    return todosBeingoLoaded.includes(todo.id);
  }, [todo.id, todosBeingoLoaded]);

  return (
    <>
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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoRemove}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </>
  );
};
