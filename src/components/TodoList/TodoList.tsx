import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[]
}

export const TodoList: React.FC<Props> = React.memo(
  ({ todos }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => <TodoItem todo={todo} key={todo.id} />)}
      </section>
    );
  },
);
