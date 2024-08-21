import React from 'react';
import { Todo } from '../types/Todo';
import ToDoItem from './ToDoItem'; // Импортируем ToDoItem

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo?: Todo | null; // Добавляем пропс для временной задачи
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && (
        <div className="todo-item todo-item--loading">
          <input type="checkbox" className="toggle" disabled />
          <label>{tempTodo.title}</label>
          <div className="loader" />
        </div>
      )}

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
