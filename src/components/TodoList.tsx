import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { StateContext } from '../management/TodoContext';
import { Filter } from '../types/Filter';

export const TodoList: React.FC = () => {
  const {
    todos,
    filterBy,
    tempTodo,
    isLoading,
  } = useContext(StateContext);

  const getFilteredTodos = () => {
    switch (filterBy) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);

      case Filter.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {getFilteredTodos().map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={isLoading}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} tempTodo={tempTodo} />}
    </section>
  );
};
