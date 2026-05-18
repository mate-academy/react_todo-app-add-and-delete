import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isProcessed />}
    </section>
  );
};
