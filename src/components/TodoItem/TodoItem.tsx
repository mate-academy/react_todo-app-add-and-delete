import React from 'react';
import classNames from 'classnames';
import { useTodos } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    tempTodos,
    setError,
    setTodos,
    setTempTodos,
  } = useTodos();

  const handlerDelete = async (todoId: number) => {
    try {
      setError('');
      setTempTodos([todo]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos
        .filter((item) => item.id !== todo.id));
    } catch (error) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setTempTodos([]);
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
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handlerDelete(todo.id)}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': tempTodos.some(item => item.id === todo.id),
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
