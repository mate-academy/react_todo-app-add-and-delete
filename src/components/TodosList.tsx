import React, { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodosItem } from './TodosItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  deletedTodosID: number[];
};

export const TodosList: React.FC<Props> = memo(({
  todos,
  onDeleteTodo,
  deletedTodosID,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodosItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isDeleted={deletedTodosID.includes(todo.id)}
        />
      ))}
    </section>
  );
});
