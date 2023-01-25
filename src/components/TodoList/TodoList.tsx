import React, { memo, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  onRemoveTodo: (todoId: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  setIsAdding,
  onRemoveTodo,
}) => {
  useEffect(() => {
    setIsAdding(false);
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          removeTodo={onRemoveTodo}
        />
      ))}
    </section>
  );
});
