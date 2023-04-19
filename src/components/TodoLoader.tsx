import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type TodoLoaderProps = {
  todo: Todo,
  activeTodoId: number,
};

export const TodoLoader: React.FC<TodoLoaderProps> = ({
  todo, activeTodoId,
}) => {
  return (
    <div
      className={classNames(
        'modal', 'overlay', { 'is-active': activeTodoId === todo.id },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
