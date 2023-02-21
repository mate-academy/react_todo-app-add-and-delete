import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  deletedTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  deletedTodos,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        deletedTodos={deletedTodos}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        onDeleteTodo={onDeleteTodo}
        deletedTodos={deletedTodos}
      />
    )}
  </section>
);
