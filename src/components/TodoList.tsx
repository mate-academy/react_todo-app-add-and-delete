import React, { useContext } from 'react';
import { TodoContext } from '../context/todoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, loading, tempTodo, onDeleteTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          disabled={loading}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          disabled={loading}
        />
      )}
    </section>
  );
};
