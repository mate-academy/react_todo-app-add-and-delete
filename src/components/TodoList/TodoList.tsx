import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Error, Todo } from '../../types/todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
  completedIdx: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setHasError,
  completedIdx,
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
              isProcessing={completedIdx.includes(todo.id)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
