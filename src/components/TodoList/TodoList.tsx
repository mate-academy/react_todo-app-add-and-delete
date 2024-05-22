import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { StateContex } from '../../Store';
import { TodoItem } from '../TodoItem';
import { Filter } from '../../types/Filter';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo, tempPendingTodos } = useContext(StateContex);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ACTIVE:
        return !todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                key={todo.id}
                todo={todo}
                isPending={tempPendingTodos.includes(todo.id)}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isPending={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
