import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  loadingTodoId: number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          isLoading={loadingTodoId === todo.id}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoComponent
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          isLoading
        />
      )}
    </section>
  );
};
