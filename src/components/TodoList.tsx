import { FC } from 'react';
import React from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from '../components/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<boolean>;
  tempTodo: Todo | null;
  handleCompleteTodo: (todoId: number) => void;
};
export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  // handleCompleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          // handleCompleteTodo={handleCompleteTodo}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} deleteTodo={deleteTodo} isTemp />}
    </section>
  );
};
