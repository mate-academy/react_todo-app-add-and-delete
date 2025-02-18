import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loading: boolean;
  deletingTodoIds: number[];
  deleteTodo: (id: number) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loading,
  deleteTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              loading={deletingTodoIds.includes(todo.id)}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading={loading}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
