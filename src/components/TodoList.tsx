import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  deletingIds: number[];
  onDelete: (id: number) => void;
  tempTodo: TodoType | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={deletingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <Todo todo={tempTodo} isLoading={true} />}
    </section>
  );
};
