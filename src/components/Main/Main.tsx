import React from 'react';
import { TodoList } from '../TodoList/TodoList';

export const Main: React.FC = () => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList />
    </section>
  );
};
