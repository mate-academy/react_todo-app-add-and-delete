import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  onTodoDelete: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
        />
      ))}
    </section>
  );
};
