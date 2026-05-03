import React from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  todoId: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todoId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isDeleteLoading = todoId.some(id => id === todo.id);

        return (
          <TodoComponent
            key={todo.id}
            todo={todo}
            isLoading={isDeleteLoading}
            onDelete={onDelete}
          />
        );
      })}

      {tempTodo && (
        <TodoComponent todo={tempTodo} isLoading={true} onDelete={onDelete} />
      )}
    </section>
  );
};
