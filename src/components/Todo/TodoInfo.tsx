import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: (updater: (todos: Todo[]) => Todo[]) => void;
  setError: (newError: string) => void;
};
export const TodoInfo: React.FC<Props> = ({ todo, setTodos, setError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {title, id, completed} = todo 
  useEffect(() => {
    if (todo.id === 0) {
      setIsLoading(true);
    }
  }, [todo.id]);

  const changeComplited = () => {
    setIsLoading(true);
    updateTodo(todo.id, { completed: !todo.completed })
      .then((changedTodo: Todo) => {
        setTodos((previous: Todo[]) =>
          previous.map((t: Todo) =>
            t.id === changedTodo.id ? changedTodo : t,
          ),
        );
      })
      .catch(() => setError('cannot change todo'))
      .finally(() => setIsLoading(false));
  };

  const deleteComplited = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos((previous: Todo[]) =>
          previous.filter((t: Todo) => t.id !== todo.id),
        );
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  return (
    
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={classNames('todo', { 'completed': completed })}
      >
        <label className="todo__status-label" htmlFor={`todo-${id}`}>
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            id={`todo-${id}`}
            checked={completed}
            onChange={changeComplited}
            aria-label={
              completed ? 'Mark as incomplete' : 'Mark as complete'
            }
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={deleteComplited}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
