import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTodosContext } from '../store';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = () => {
  const { filteredTodos } = useTodosContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map((todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
