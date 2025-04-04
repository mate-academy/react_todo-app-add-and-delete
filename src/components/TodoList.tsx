import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { useTodoContext } from '../context/TodoContext';

export const TodoList: React.FC = () => {
  const { todos, tempTodo } = useTodoContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup component={null}>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            unmountOnExit
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            unmountOnExit
          >
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
