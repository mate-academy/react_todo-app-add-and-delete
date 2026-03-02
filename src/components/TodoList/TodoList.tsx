import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  loadingTodoIds: number[];
  onDeleteTodo: (id: number) => void;
};

const emptyFn = () => {};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp-todo"
          todo={tempTodo}
          isLoading={true}
          onDelete={emptyFn}
        />
      )}
    </section>
  );
};
