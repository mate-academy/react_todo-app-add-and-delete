import React from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleDelete: (todoId: number) => void;
  deletedTodoId: number,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleDelete,
  deletedTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDelete={handleDelete}
          deletedTodoId={deletedTodoId}
        />
      ))}
    </section>
  );
});
