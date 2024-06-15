import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoStatus } from '../types/TodoStatus';
import { TodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';

export const TodoMain: React.FC = () => {
  const { state } = useContext(TodoContext);

  const todos = state.todos.filter(todo => {
    switch (state.filter) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      case TodoStatus.All:
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem key={todo.id} todo={todo} />
          </CSSTransition>
        ))}

        {state.tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem key={state.tempTodo.id} todo={state.tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
