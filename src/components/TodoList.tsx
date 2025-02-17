import React from 'react';
import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </section>
  );
};
