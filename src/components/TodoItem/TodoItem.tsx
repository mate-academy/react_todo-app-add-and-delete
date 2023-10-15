import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const todoContext = useContext(TodosContext);
  const { deleteTodo } = todoContext;

  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  return (
    <li className={classNames(
      completed,
    )}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
        />
        <label>{title}</label>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          data-cy="deleteTodo"
          className="destroy"
          onClick={handleDeleteTodo}
        />
      </div>
      <div className="modal overloy">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
