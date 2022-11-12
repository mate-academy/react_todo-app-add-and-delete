import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  visibleTodos: Todo[],
};

export const TodoList: React.FC<Props> = ({ visibleTodos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(({
        id,
        completed,
        title,
      }) => (
        <TodoInfo
          key={id}
          completed={completed}
          title={title}
        />
      ))}
    </section>
  );
};
