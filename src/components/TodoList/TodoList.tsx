import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  activeTodoId: number | null;
  temporaryTodo: Todo | null;
  onDelete: (id: number) => void;
  isDeleteDisabled: boolean | null | 0;
};

export const TodoList: React.FC<Props> = ({
  todos,
  activeTodoId,
  temporaryTodo,
  onDelete,
  isDeleteDisabled,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isDeleteDisabled={isDeleteDisabled}
        isLoading={activeTodoId ? activeTodoId === todo.id : false}
      />
    ))}

    {temporaryTodo && (
      <TodoInfo
        key={temporaryTodo.id}
        todo={temporaryTodo}
        onDelete={onDelete}
        isDeleteDisabled={true}
        isLoading={!!temporaryTodo}
      />
    )}
  </section>
);
