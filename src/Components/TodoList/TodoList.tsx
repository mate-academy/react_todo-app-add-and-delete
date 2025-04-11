import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (value: number) => Promise<void>;
  tempTodo: Todo | null;
  isLoading: boolean;
  deletingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  isLoading,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={isLoading}
          isBeingDeleted={deletingTodoId === todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={true}
          isBeingDeleted={false}
        />
      )}
    </section>
  );
};
