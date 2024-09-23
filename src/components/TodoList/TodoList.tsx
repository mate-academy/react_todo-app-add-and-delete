import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  isLoadingTodo: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  deletingTodoId,
  tempTodo,
  isLoadingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          deletingTodoId={deletingTodoId}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          deletingTodoId={deletingTodoId}
          isLoadingTodo={isLoadingTodo}
        />
      )}
    </section>
  );
};
