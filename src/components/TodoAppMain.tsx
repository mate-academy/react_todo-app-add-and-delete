/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { StateContext } from '../context/ContextReducer';
import { TodoInfo } from './TodoInfo';

export const TodoAppMain: React.FC = () => {
  const { todoApi } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoApi.map(todo => (
        <TodoInfo key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
