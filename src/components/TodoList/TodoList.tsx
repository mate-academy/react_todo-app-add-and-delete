import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodoFromServer: (todoToRemoveId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodoFromServer,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, title, completed }) => (
        <TodoItem
          key={id}
          id={id}
          title={title}
          isCompleted={completed}
          removeTodoFromServer={removeTodoFromServer}
        />
      ))}
    </section>
  );
};
