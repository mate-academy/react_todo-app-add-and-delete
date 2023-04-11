import React from 'react';
import { TodoListItem } from '../TodoListItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => void,
  completedTodosId: number[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onTodoDelete,
  completedTodosId,
}) => (
  <section className="todoapp__main">
    {todos?.map(todo => (
      <TodoListItem
        todo={todo}
        key={todo.id}
        onTodoDelete={onTodoDelete}
        completedTodosId={completedTodosId}
      />
    ))}
  </section>
));
