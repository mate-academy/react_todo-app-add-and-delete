import React from 'react';
import { useTodos } from '../context/TodoProvider';
import { getFilteredItems } from '../services/getFilteredItems';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    todos,
    filterBy,
    tempTodo,
  } = useTodos();

  const filterCompletedItems = getFilteredItems(todos, filterBy);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterCompletedItems.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <TodoItem key={tempTodo?.id} todo={tempTodo} />
      )}
    </section>
  );
};
