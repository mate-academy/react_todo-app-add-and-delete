import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  filter: string;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  filter,
}) => {
  const filteredTodos =
    filter === 'active'
      ? todos.filter(todo => !todo.completed)
      : filter === 'completed'
        ? todos.filter(todo => todo.completed)
        : todos;

  const noTodosMessage =
    filter !== 'all' && filteredTodos.length === 0 ? (
      <p className="todoapp__empty-list-message"></p>
    ) : null;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onDelete={() => onDeleteTodo(todo.id)}
          onToggle={() => onToggleTodo(todo.id)}
        />
      ))}
      {noTodosMessage}
    </section>
  );
};
