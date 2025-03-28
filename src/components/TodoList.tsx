import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  loading: boolean;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  loadingIds,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo
              todo={todo}
              loading={loading}
              loadingIds={loadingIds}
              handleDeleteTodo={handleDeleteTodo}
              key={todo.id}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
