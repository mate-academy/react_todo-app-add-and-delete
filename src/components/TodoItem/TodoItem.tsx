/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';
import { TodoDeleteButton } from '../TodoDeleteButton/TodoDeleteButton';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, onDeleteTodo }) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
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

      <TodoDeleteButton onDelete={() => onDeleteTodo(todo.id)} />

      <Loader />
    </div>
  );
};
