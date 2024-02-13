import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { StateContext } from '../management/TodoContext';
import { Filter } from '../types/Filter';

export const TodoList: React.FC = () => {
  const {
    todos,
    filterBy,
    tempTodo,
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

  const visibleTodos = getFilteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
