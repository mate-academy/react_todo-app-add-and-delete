/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todos } from '../Todos/Todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  loadingTodo: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loadingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todos
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          loadingTodo={loadingTodo}
        />
      ))}
    </section>
  );
};
