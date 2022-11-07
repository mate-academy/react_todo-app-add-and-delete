import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
};

export const TodosCountInfo: React.FC<Props> = React.memo(({ todos }) => {
  const leftTodos = todos.filter(({ completed }) => !completed);

  return (
    <span className="todo-count" data-cy="todosCounter">
      {`${leftTodos.length} items left`}
    </span>
  );
});
