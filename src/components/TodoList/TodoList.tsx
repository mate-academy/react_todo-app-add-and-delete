import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onTodoRemove: (todoId: number) => Promise<void>,
  loadingTodoId: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoRemove,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onRemove={async () => onTodoRemove(todo.id)}
          isLoading={loadingTodoId.includes(todo.id)}
        />
      ))}
    </section>
  );
};
