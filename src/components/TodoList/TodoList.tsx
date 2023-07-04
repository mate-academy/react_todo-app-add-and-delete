import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/todo';

interface Props {
  todos: Todo[];
  onDelete: CallableFunction;
  loadingTodos: number[];
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodos,
  tempTodo,
}) => (

  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingTodos={loadingTodos}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        loadingTodos={loadingTodos}
        onDelete={onDelete}
      />
    )}
  </section>
);
