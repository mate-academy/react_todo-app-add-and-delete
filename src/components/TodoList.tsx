import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  deleteIds: number[];
  onDelete: (id: number) => void;
  tempTodo?: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  deleteIds,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {isLoading && <div data-cy="TodoLoader" className="loader"></div>}

      {!isLoading && (
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                isDeleting={deleteIds.includes(todo.id)}
                onDelete={onDelete}
              />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem todo={tempTodo} isTemp />
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </section>
  );
};
