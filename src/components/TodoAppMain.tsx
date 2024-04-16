/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { StateContext } from '../context/ContextReducer';
import { TodoInfo } from './TodoInfo';
import { Loader } from './Loader';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../styles/animation.scss';

export const TodoAppMain: React.FC = () => {
  const { todoApi, fetch, addItem } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todoApi.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo todo={todo} />
          </CSSTransition>
        ))}
        {fetch && addItem && (
          <CSSTransition key="loader" timeout={300} classNames="item">
            <div className="todo">
              <span className="todo__title">
                <br />
                <Loader />
              </span>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
