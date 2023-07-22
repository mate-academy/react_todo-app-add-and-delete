import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Error, Todo } from '../../types/todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setHasError,
  isLoading,
  setIsLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              setHasError={setHasError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
