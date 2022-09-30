import React from 'react';
import { Todo } from '../../types/Todo';
import { UserTodo } from '../Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({ todos, deleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <UserTodo
              todo={todo}
              deleteTodo={deleteTodo}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
