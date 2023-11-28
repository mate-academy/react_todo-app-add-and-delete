import React, { useContext } from 'react';

import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosContext';

export const Todolist: React.FC = () => {
  const { todos, filter } = useContext(TodosContext);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'Active':
        return todo.completed === false;

      case 'Completed':
        return todo.completed === true;

      case 'All':
      default:
        return todos;
    }
  });

  return (

    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
