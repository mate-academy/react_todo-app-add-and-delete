import React, { useContext, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosContext';
import { Filtering } from '../types/Filtering';

export const TodoList: React.FC = () => {
  const { todos, filtering, tempTodo } = useContext(TodosContext);

  const visibleTodos = useMemo(() => {
    switch (filtering) {
      case Filtering.ALL:
        return todos;
      case Filtering.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filtering.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filtering]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo !== null && (
        <TodoItem todo={tempTodo} key={tempTodo.id} isLoading />
      )}
    </section>
  );
};
