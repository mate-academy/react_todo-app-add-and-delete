import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  loadingTodoIds: number[];
};

export const TodoList = React.memo(
  ({ todos, onTodoDelete, loadingTodoIds }: Props) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onTodoDelete={onTodoDelete}
            loading={loadingTodoIds.includes(todo.id)}
          />
        ))}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
