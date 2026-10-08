import React from 'react';
import PropTypes from 'prop-types';

import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  processings: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, processings, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isLoading={processings.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  processings: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  onDelete: PropTypes.func.isRequired,
};
