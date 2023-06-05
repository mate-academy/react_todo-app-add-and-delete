import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[],
  filterType: string,
  onDeleteTodo: (id: number) => void,
}

const TodoList: React.FC<TodoListProps>
= ({ todos, filterType, onDeleteTodo }) => {
  const filteredTodos = todos.filter((todo) => {
    if (filterType === 'active') {
      return !todo.completed;
    }

    if (filterType === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp__list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
