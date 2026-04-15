import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoRecord } from '../Todo/todoRecord';

type Props = {
  todoList: Todo[];
  loadedTodosIds: Set<number>;
  handelDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  loadedTodosIds,
  handelDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => {
        return (
          <TodoRecord
            key={todo.id}
            todo={todo}
            isLoaded={loadedTodosIds.has(todo.id)}
            handelDelete={() => handelDelete(todo.id)}
          />
        );
      })}
    </section>
  );
};
