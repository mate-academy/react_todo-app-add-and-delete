import React, { useContext } from 'react';
import { TodoList } from '../TodoList';
import { TodosContext } from '../../context/TodosContext';
import { getFilteredTodos } from '../../services/todosService';

export const Main: React.FC = () => {
  const { todos, status } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList todos={getFilteredTodos(todos, status)} />
    </section>
  );
};
