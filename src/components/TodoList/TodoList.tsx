import React from 'react';
import { Todo, TodoId } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

interface Props {
  todos: Todo[];
  skeletonTodo?: Todo | null;
  onDelete: (todoId: TodoId) => Promise<boolean>;
  loadingTodoId: TodoId | null;
  onChange: (newTodo: Todo) => Promise<boolean>;
  editingId: TodoId | null;
  setEditingId: (id: TodoId | null) => void;
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    skeletonTodo,
    onDelete,
    onChange,
    loadingTodoId,
    editingId,
    setEditingId,
  }) => {
    return (
      <ul>
        {todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onChange={onChange}
              isLoading={loadingTodoId === todo.id}
              isEditing={editingId === todo.id}
              setEditingId={setEditingId}
            />
          );
        })}
        {skeletonTodo && (
          <TodoItem
            key={skeletonTodo.id}
            todo={skeletonTodo}
            isLoading={true}
            isEditing={false}
            onDelete={async () => false}
            onChange={async () => false}
            setEditingId={() => {}}
          />
        )}
      </ul>
    );
  },
);

TodoList.displayName = 'TodoList';
