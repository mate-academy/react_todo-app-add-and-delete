import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../../types';

import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: number[];
  isSubmitting: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  isSubmitting,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              isLoading={isLoading.includes(todo.id)}
              isSubmitting={isSubmitting}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              isLoading={isLoading.includes(0)}
              isSubmitting={isSubmitting}
              onDelete={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
