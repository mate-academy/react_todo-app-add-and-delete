import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  processingIds: number[];
  onDeleteTodo: (id: number) => void;
  isCreating: boolean;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading: isLoading,
  processingIds,
  onDeleteTodo,
  isCreating: isCreating,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {isLoading && <div className="loader is-overlay" data-cy="TodoLoader" />}
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={processingIds.includes(todo.id)}
              processingIds={processingIds}
              onDelete={() => onDeleteTodo(todo.id)}
            />
          </CSSTransition>
        ))}
        {isCreating && tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading processingIds={[]} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
