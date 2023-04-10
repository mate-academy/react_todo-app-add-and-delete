import React from 'react';
import { TodoListItem } from '../TodoListItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => void,
  completedTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  completedTodoId,
}) => (
  <section className="todoapp__main">
    {todos?.map(todo => (
      <TodoListItem
        todo={todo}
        key={todo.id}
        onTodoDelete={onTodoDelete}
        completedTodoId={completedTodoId}
      />
    ))}
  </section>
);
