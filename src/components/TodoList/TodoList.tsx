import React from 'react';
import { Todo } from '../../api/todos';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  loadingIds?: Set<number>;
  disableActions?: boolean;
  tempTodo: Todo | null;
  onDelete: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  disableActions = false,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todo-list" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            loading={loadingIds?.has(todo.id) ?? false}
            disableActions={disableActions}
            onDelete={onDelete}
          />
        ))}

        {/* temp todo (id: 0) shown after list while creating */}
        {tempTodo && (
          <TodoItem
            key={0}
            todo={tempTodo}
            loading
            disableActions
            onDelete={() => {}}
          />
        )}
      </ul>
    </section>
  );
};
