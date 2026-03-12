import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoIds: number[];
  onDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onDelete={onDeleteTodo}
        />
      ))}
    </section>
  );
};
