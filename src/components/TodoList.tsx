import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  loadingTodoIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
