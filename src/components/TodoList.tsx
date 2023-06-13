import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  loadingTodo: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  loadingTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              loadingTodo={loadingTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              removeTodo={removeTodo}
              loadingTodo={loadingTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
