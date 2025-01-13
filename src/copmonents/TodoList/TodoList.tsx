import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (postId: number) => void;
  deletingTodoIds?: number[] | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  deletingTodoIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loading={deletingTodoIds?.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} deleteTodo={deleteTodo} loading />}
    </section>
  );
};
