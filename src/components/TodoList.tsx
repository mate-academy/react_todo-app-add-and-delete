import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoId: number[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={deletingTodoId.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
