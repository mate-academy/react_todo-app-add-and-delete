import React from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  todos: Todo[] | null,
  tempTodo?: Todo | null,
  deleteTodos: (todoId: number) => void,
  removingId: number | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodos,
  removingId,
}) => {
  return (
    <section className="todoapp__main">
      {todos?.map(todo => (
        <TodoElement
          todo={todo}
          key={todo.id}
          deleteTodos={deleteTodos}
          removingId={removingId}
        />
      ))}
      {tempTodo && (
        <TodoElement
          todo={tempTodo}
        />
      )}
    </section>
  );
};
