import React from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../Item/Item';
import { TodoRemoveHandler } from '../../../types/TodoMethods';

type Props = {
  todos: Todo[];
  deletedTodoIds: Todo['id'][];
  temporaryTodo: Todo | null;
  onTodoRemove: TodoRemoveHandler;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, deletedTodoIds, temporaryTodo, onTodoRemove }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onRemove={onTodoRemove}
            isLoading={deletedTodoIds.includes(todo.id)}
          />
        ))}
        {temporaryTodo && (
          <TodoItem
            key={-1}
            todo={temporaryTodo}
            onRemove={() => {}}
            isLoading={true}
          />
        )}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
