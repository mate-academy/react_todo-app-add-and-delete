import React from 'react';
import { Todo } from '../../types/Todo';
import { UserTodo } from '../Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (todo: Todo) => void;
  isCompleted: boolean;
  visibleLoader: boolean;
  setVisibleLoader: (loader: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isCompleted,
  visibleLoader,
  setVisibleLoader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <UserTodo
              todo={todo}
              deleteTodo={deleteTodo}
              isCompleted={isCompleted}
              visibleLoader={visibleLoader}
              setVisibleLoader={setVisibleLoader}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
