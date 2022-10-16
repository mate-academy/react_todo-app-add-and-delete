import React from 'react';

import { TodoInfo } from './TodoInfo';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleChangeStatus: (todoId: number, status: boolean) => void,
  handleDeleteTodo: (todoId: number) => void,
  isLoadingTodosId: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleChangeStatus,
  handleDeleteTodo,
  isLoadingTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading = isLoadingTodosId.includes(todo.id);

        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            handleChangeStatus={handleChangeStatus}
            handleDeleteTodo={handleDeleteTodo}
            isLoading={isLoading}
          />
        );
      })}
    </section>
  );
};
