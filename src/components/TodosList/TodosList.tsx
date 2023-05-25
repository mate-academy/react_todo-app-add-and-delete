import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  handleDeleteTodo: (todoId: number) => void,
  pendingStatus: boolean,
  pendingTodoIds: number[],
};

export const TodosList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleDeleteTodo,
  pendingStatus,
  pendingTodoIds,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          pendingStatus={pendingStatus}
          pendingTodoIds={pendingTodoIds}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          pendingStatus={pendingStatus}
          pendingTodoIds={pendingTodoIds}
        />
      )}
    </section>
  );
};
