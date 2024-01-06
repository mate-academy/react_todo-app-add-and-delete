import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[]
}

export const TodosCounter: React.FC<Props> = ({ todos }) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

  );
};
