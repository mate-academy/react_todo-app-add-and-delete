import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[],
  filterType: string,
}

const TodoList: React.FC<TodoListProps> = ({ todos, filterType }) => {
  const filteredTodos = todos.filter((todo) => {
    switch (filterType) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};

export default TodoList;
