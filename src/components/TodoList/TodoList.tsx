import React from 'react';

import { Todo } from '../../types/Todo';
import { Todo as TodoItem } from '../Todo';

type Props = {
  todos: Todo[];
  className?: string;
};

const TodoListBase: React.FC<Props> = ({ todos, className }) => {
  return (
    <section className={className} data-cy="TodoList">
      <div>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </section>
  );
};

export const TodoList = React.memo(TodoListBase);
