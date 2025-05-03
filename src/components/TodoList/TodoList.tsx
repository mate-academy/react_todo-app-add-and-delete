import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteId: number[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={deleteId.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isProcessing={true}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
