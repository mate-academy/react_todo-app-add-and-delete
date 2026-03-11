/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleDeleteTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={deletingTodoIds.includes(todo.id)}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          handleDeleteTodo={handleDeleteTodo}
        />
      )}
    </section>
  );
};
