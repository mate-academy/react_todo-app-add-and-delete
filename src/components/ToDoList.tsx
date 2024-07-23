import React from 'react';
import { Todo } from '../types/Todo';
import ToDoItem from './ToDoItem'; // Импортируем ToDoItem

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ToDoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </section>
  );
};

export default TodoList;
