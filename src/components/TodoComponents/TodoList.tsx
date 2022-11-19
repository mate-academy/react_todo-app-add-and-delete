import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  isAdding: boolean,
  onRemove: (id: number) => Promise<void>,
  activeTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  isAdding,
  onRemove,
  activeTodoIds,
}) => (

  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(todo => {
      return (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          activeTodoIds={activeTodoIds}
        />
      );
    })}

    {isAdding && tempTodo && (
      <TodoInfo
        todo={tempTodo}
        key={tempTodo.id}
        onRemove={onRemove}
        activeTodoIds={activeTodoIds}
      />
    )}
  </section>
);
