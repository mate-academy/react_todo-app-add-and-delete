import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void;
  deleteCompleted: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  deleteCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deleteCompleted={deleteCompleted}
        />
      ))}
    </section>
  );
};
