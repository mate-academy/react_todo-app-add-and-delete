import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  errorMessage: string;
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  todos,
  errorMessage,
  setTodos,
  setErrorMessage,
  inputRef,
}) => {
  const { id, title, completed } = todo;
  const [todoClass, setTodoClass] = useState('todo');
  const [todoLoading, setTodoLoading] = useState(false);

  useEffect(() => {
    if (completed) {
      setTodoClass('todo completed');
    }
  }, [completed]);

  const completeTodo = () => {
    if (todoClass === 'todo completed') {
      setTodoClass('todo');
    } else {
      setTodoClass('todo completed');
    }
  };

  const removeTodo = (todoId: number) => {
    setTodoLoading(true);
    setTodoClass('todo item-exit');

    deleteTodo(todoId)
      .then(() => {
        const filterTodos: Todo[] = todos.filter(
          someTodo => someTodo.id !== todoId,
        );

        setTimeout(() => {
          setTodoClass('todo item-exit item-exit-active');
          inputRef.current?.focus();
        }, 200);

        setTimeout(() => {
          setTodos(filterTodos);
        }, 500);
      })
      .catch(() => {
        setTimeout(() => {
          setErrorMessage('Unable to delete a todo');
          setTodoLoading(false);
        }, 200);

        if (!errorMessage) {
          setTimeout(() => {
            setErrorMessage('');
          }, 3200);
        }
      });
  };

  return (
    <div data-cy="Todo" className={todoClass}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={completeTodo}
        />
        {''}
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
