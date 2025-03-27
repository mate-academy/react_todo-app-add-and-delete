import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deletedIds: number[];
  loadingTodo: Todo | null;
  onTodoEdit: (editedTodo: Todo) => void;
  onTodoRemove: (idToRemove: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, deletedIds, loadingTodo, onTodoEdit, onTodoRemove }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={onTodoEdit}
              onRemove={onTodoRemove}
              isLoading={deletedIds.includes(todo.id)}
            />
          );
        })}
        {!!loadingTodo && (
          <TodoItem
            key={999}
            todo={loadingTodo}
            onEdit={() => {}}
            onRemove={() => {}}
            isLoading={true}
          />
        )}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
