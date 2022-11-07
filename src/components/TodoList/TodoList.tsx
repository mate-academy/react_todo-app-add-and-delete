import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  handleDeleteTodo:(todoId: number) => void,
  deletingTodosIds: number[]
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  deletingTodosIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        handleDeleteTodo={handleDeleteTodo}
        deletingTodosIds={deletingTodosIds}
      />
    ))}
  </section>
);
