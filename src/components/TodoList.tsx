import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodos } from '../utils/TodoContext';
import { filterTodos } from '../utils/filterTodos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useTodos();

  const visibleTodos = filterTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
