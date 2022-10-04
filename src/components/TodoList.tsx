import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './Auth/TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (param: number) => Promise<void>,
  isAdding: boolean,
  title: string,
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  isAdding,
  title,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              isAdding={isAdding}
            />
          </CSSTransition>
        ))}
        {(isAdding) && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={Math.random()}
              todo={{
                id: 0,
                title,
                completed: false,
                userId: Math.random(),
              }}
              removeTodo={removeTodo}
              isAdding={isAdding}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
