import React from 'react';
import { Todo } from '../../types/Todo';
import { UserTodo } from '../Todo';

type Props = {
  todos: Todo[];
  todoDelete: (todo: Todo) => void;
  isCompleted: boolean;
  visibleLoader: boolean;
  newTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoDelete,
  isCompleted,
  visibleLoader,
  newTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <UserTodo
              todo={todo}
              todoDelete={todoDelete}
              isCompleted={isCompleted}
              visibleLoader={visibleLoader}
              newTodoId={newTodoId}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
