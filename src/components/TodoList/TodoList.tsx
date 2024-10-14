import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[] | null;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  isLoading: boolean;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  isLoading,
  loadingTodoIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos &&
        todos.map((todo: Todo) => (
          <TodoItem
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            isLoading={loadingTodoIds.includes(todo.id)}
            key={todo.id}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          isLoading={true}
        />
      )}
    </section>
  );
};
