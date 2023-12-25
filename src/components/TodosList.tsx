import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null;
  todoIds: number[];
};

export const TodosList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  tempTodo,
  todoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            todoIds={todoIds}
            key={todo.id}
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
            todoIds={todoIds}
            key={tempTodo.id}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
