import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  handleDeleteTodo: (todoId: number) => void,
  pendingTodoIds: number[],
};

export const TodosList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleDeleteTodo,
  pendingTodoIds,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isProcessed={pendingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          isProcessed={pendingTodoIds.includes(0)}
        />
      )}
    </section>
  );
};
