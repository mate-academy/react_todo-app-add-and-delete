import React from 'react';
import { Todo } from '../../types/Todo';
import { UserTodo } from '../Todo';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <UserTodo todo={todo} />
          </li>
        ))}
      </ul>
    </section>
  );
};
