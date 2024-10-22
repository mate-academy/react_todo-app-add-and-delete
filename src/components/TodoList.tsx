import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoIds: number[];
  setDeletingTodoIds: (prevIds: (ids: number[]) => number[]) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  setDeletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          deletingTodoIds={deletingTodoIds}
          setDeletingTodoIds={setDeletingTodoIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
