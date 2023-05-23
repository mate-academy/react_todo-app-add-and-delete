import React from 'react';
import { Todo } from './types/Todo';
import { TodoComponent } from './TodoComponent';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
};

export const TodosList:React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDelete,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoComponent
        key={todo.id}
        todo={todo}
        loadingTodoId={loadingTodoId}
        onDelete={onDelete}
      />
    ))}
    {tempTodo && (
      <TempTodo
        todo={tempTodo}
        loadingId={loadingTodoId}
      />
    )}
  </section>
);
