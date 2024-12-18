import React from 'react';
import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  isDeleting: boolean;
  setIsDeleting: (isDel: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  isDeleting,
  setIsDeleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          tempTodo={null}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      ))}
      {tempTodo && (
        <TodoCard
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          tempTodo={tempTodo}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      )}
    </section>
  );
};
