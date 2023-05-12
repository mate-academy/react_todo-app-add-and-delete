import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  tempTodo: Todo | null;
  isProcessingId: number[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos, removeTodo, tempTodo, isProcessingId,
}) => (
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
            isProcessingId={isProcessingId}
            removeTodo={removeTodo}
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
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
