import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosContext';
import { Filtering } from '../types/Filtering';

export const TodoList: React.FC = () => {
  const { todos, filtering, tempTodo } = useContext(TodosContext);

  const visibleTodos = (currentFiltering: Filtering) => {
    switch (currentFiltering) {
      case Filtering.ACTIVE:
        return todos.filter((t) => !t.completed);
      case Filtering.COMPLETED:
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos(filtering).map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo !== null && (
        <TodoItem todo={tempTodo} key={tempTodo.id} isLoading />
      )}
    </section>
  );
};
