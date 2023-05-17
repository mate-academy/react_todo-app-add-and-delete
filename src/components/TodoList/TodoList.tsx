import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types';

interface Props {
  todos: Todo[];
  onDelete: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDelete,
  tempTodo,
}) => {
  const isCreating = tempTodo?.id === 0;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}

      {isCreating && (
        <TodoItem
          todo={tempTodo}
          todoId={tempTodo.id}
        />
      )}
    </section>
  );
});
