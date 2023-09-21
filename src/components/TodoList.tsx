import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { SingleTodo } from './SingleTodo';

type TodoListProps = {
  filter: Filter;
  todos: Todo[];
  handleRemove: (todoId: number) => void;
};

export const TodoList: React.FC<TodoListProps>
= ({ filter, todos, handleRemove }) => {
  const visibleTodos = () => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos().map(todo => (
        <SingleTodo key={todo.id} todo={todo} handleRemove={handleRemove} />
      ))}
    </section>
  );
};
