import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';

interface Props {
  todo: Todo
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    setHasErrorMessage,
    setIsHiddenError,
    tempTodo,
    setLoading,
    isLoading,
  } = useContext(TodosContext);

  useEffect(() => {
    if (tempTodo && tempTodo.id === todo.id) {
      setLoading(tempTodo.id);
    }
  }, [tempTodo, todo.id]);

  const hangleDeleteTodo = async (userId: number) => {
    try {
      setLoading(userId);
      await deleteTodo(userId);
      setTodos((prevTodos) => prevTodos.filter(item => item.id !== userId));
    } catch (error) {
      setHasErrorMessage('Unable to delete a todo');
      setIsHiddenError(true);
      setTimeout(() => {
        setIsHiddenError(true);
      }, 3000);

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => hangleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading[todo.id],
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
