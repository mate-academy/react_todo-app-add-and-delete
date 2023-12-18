import React from 'react';

import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = React.memo(({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => <TodoItem todo={todo} key={todo.id} />)}

      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
});
