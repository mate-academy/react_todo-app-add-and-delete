/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { StateContext } from '../context/ContextReducer';
import { TodoInfo } from './TodoInfo';
import { Loader } from './Loader';

export const TodoAppMain: React.FC = () => {
  const { todoApi, fetch, addItem } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoApi.map(todo => (
        <TodoInfo key={todo.id} todo={todo} />
      ))}

      {fetch && addItem && (
        <div className="todo">
          <span className="todo__title">
            <br />
            <Loader />
          </span>
        </div>
      )}
    </section>
  );
};
