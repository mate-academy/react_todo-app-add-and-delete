import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  handleToggleTodo: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  handleDeleteTodo,
  handleToggleTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          data-cy="Todo"
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodo={handleToggleTodo}
        />
      ))}
    </section>
  );
};

export default TodoList;
