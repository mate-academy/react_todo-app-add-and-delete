import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  processings: number[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  processings,
  tempTodo,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isProcessed={processings.includes(todo.id)}
              onDelete={onDeleteTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
