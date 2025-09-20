import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: (Todo & { loading?: boolean })[];
  toggleTodo: (id: number) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  handleDelete,
  handleUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        toggleTodo={toggleTodo}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    ))}
  </section>
);
