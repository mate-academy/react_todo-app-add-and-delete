import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoListItem } from '../TodoListItem';

type Props = {
  todos: Todo[]
};

export const TodoList: React.FC<Props> = React.memo(({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
});
