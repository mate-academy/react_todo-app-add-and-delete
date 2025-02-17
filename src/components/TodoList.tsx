import React from 'react';
import { Todos } from './Todos';

export const TodoList: React.FC = () => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <Todos />
    </section>
  );
};
