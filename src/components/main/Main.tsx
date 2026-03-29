import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todo/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handlerDeleteTodo: (id: number) => void;
  deleting: number | null;
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handlerDeleteTodo,
  deleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(toDo => {
        return (
          <TodoItem
            key={toDo.id}
            toDo={toDo}
            isLoading={false}
            handlerDeleteTodo={handlerDeleteTodo}
            deleting={deleting === toDo.id}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          key={0}
          toDo={tempTodo}
          isLoading={true}
          handlerDeleteTodo={handlerDeleteTodo}
          deleting={deleting === 0}
        />
      )}
    </section>
  );
};
