import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type TodoLoaderProps = {
  todo: Todo,
  loadingActiveTodoId: number[],
};

export const TodoLoader: React.FC<TodoLoaderProps> = ({
  todo, loadingActiveTodoId,
}) => {
  const isLoading = loadingActiveTodoId.includes(todo.id);

  return (
    <div
      className={classNames(
        'modal', 'overlay', { 'is-active': isLoading },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
