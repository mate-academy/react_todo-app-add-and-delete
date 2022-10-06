import classnames from 'classnames';
import React from 'react';
import { Loader } from './Loader';
import { Todo } from '../types/Todo';

type Props = {
  // todos: Todo[],
  isLoading: boolean
  todo: Todo,
  // isAdding: boolean,
  deleteTodo:(param: number) => void,
};

export const NewTodo: React.FC<Props> = ({
  // todos,
  isLoading,
  todo,
  // isAdding,
  deleteTodo,
}) => {
  // const deleteComplitedTodo = (todoId: number, completed: boolean) => {
  //   if ()
  // };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classnames(
        'todo',
        {
          completed: todo.completed === true,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {!isLoading && (
        <Loader />
      )}

    </div>
  );
};
