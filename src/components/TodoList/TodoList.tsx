import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[] | null;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  loading: boolean;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  loading,
  deletingTodoId,
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
            loading={loading}
            deletingTodoId={deletingTodoId}
            key={todo.id}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          loading={loading}
          deletingTodoId={deletingTodoId}
        />
      )}
    </section>
  );
};
