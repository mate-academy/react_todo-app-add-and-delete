import React from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './Todo';

type Props = {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deletePost: (id: number) => void;
  loadingTodos: number[]; // Массив ID задач с лоадером
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  deletePost,
  loadingTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoComponent
        key={todo.id}
        todo={todo}
        toggleTodo={toggleTodo}
        deletePost={deletePost}
        isLoading={loadingTodos.includes(todo.id)}
      />
    ))}
  </section>
);
