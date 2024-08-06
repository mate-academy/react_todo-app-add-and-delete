import React from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './Todo';

type Props = {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deletePost: (id: number) => void;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  deletePost,
  isLoading,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoComponent
        key={todo.id}
        todo={todo}
        toggleTodo={toggleTodo}
        deletePost={deletePost}
        isLoading={isLoading}
      />
    ))}
  </section>
);
