import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  idsToDelete: number[],
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, idsToDelete }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          idsToDelete={idsToDelete}
        />
      ))}
    </section>
  );
};
