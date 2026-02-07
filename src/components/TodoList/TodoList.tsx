import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  prepareTodos: () => Todo[];
  deletedId: number[];
  tempTodo: Todo | null;
  handleDelete: (id: number) => Promise<number>;
};

export const TodoList: React.FC<Props> = ({
  prepareTodos,
  handleDelete,
  deletedId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {prepareTodos().map(todo => (
        <TodoItem
          key={todo.id}
          title={todo.title}
          completed={todo.completed}
          isLoading={false}
          deletedId={deletedId}
          id={todo.id}
          handleDelete={() => handleDelete(todo.id)}
        />
      ))}
      {!!tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={tempTodo.completed}
          isLoading={true}
        />
      )}
    </section>
  );
};
