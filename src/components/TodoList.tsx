import React from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  todos: Todo[];
  isSubmitting: boolean;
  isDeleting: boolean;
  handleRemoveTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isSubmitting,
  isDeleting,
  handleRemoveTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          todo={todo}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          handleRemoveTodo={handleRemoveTodo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
