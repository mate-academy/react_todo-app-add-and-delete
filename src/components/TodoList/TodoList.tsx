import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[]
  isActive: boolean,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const { todos, isActive } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isActive={isActive}
        />
      ))}
    </section>
  );
});
