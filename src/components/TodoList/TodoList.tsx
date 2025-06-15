import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
  isAdding: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  onDelete,
  tempTodo,
  loadingIds,
  isAdding,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        toggleTodoStatus={onToggle}
        deleteTodo={onDelete}
        isDisabled={loadingIds.includes(todo.id)}
        isLoading={!isAdding && loadingIds.includes(todo.id)}
      />
    ))}

    {tempTodo && isAdding && (
      <TodoItem
        todo={tempTodo}
        isTemp={true}
        isLoading={true}
        isDisabled={true}
        toggleTodoStatus={() => {}}
        deleteTodo={() => {}}
      />
    )}
  </section>
);
