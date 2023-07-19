import React from 'react';

import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { TodoErrors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => void;
  onCheckedTodo: (todoId: number) => void;
  tempTodoId: number | null;
  handleImputTodo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: TodoErrors | null;
  temporaryNewTodo?: Todo | null
};

export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onCheckedTodo,
  tempTodoId,
  handleImputTodo,
  error,
  temporaryNewTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          error={error}
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          onCheckedTodo={onCheckedTodo}
          loading={todo.id === tempTodoId}
          handleImputTodo={handleImputTodo}
        />
      ))}
      {
        temporaryNewTodo
        && (
          <TodoItem
            todo={temporaryNewTodo}
            loading
          />
        )
      }
    </section>
  );
};
