import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletePost: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, deletePost }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} deletePost={deletePost} />
      ))}
    </section>
  );
};
