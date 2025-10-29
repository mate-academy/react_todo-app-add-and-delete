import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoType[];
  tempTodo: TodoType | null;
  onDeleteTodo: (id: number) => void;
  deletingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  onDeleteTodo,
  deletingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          deletingIds={deletingIds}
        />
      ))}

      {tempTodo && (
        <Todo todo={tempTodo} onDeleteTodo={onDeleteTodo} deletingIds={[0]} />
      )}
    </section>
  );
};
