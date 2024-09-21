import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todosFromServer: Todo[];
  onDelete: (v: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todosFromServer,
  onDelete,
  tempTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFromServer.map(todo => (
        <TodoItem
          key={todo.id}
          todoInfo={todo}
          deleteTodo={onDelete}
          loadingIds={loadingIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todoInfo={tempTodo}
          deleteTodo={onDelete}
          loadingIds={[0]}
        />
      )}
    </section>
  );
};
