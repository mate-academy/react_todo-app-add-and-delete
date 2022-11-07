import React from 'react';
import { TodoItem } from '../TodoItem';
import { AddingTodoItem } from '../AddingTodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  isLoading: boolean,
  todoTitle: string,
  deleteTodo: (todoId: number) => void;
  deletedTodoId: number[],
  onCompleteTodo: (todoId: number) => void;
};

export const TodoBody: React.FC<Props> = React.memo(({
  visibleTodos,
  isLoading,
  todoTitle,
  deleteTodo,
  deletedTodoId,
  onCompleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {
        visibleTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            isLoading={isLoading}
            deletedTodoId={deletedTodoId}
            onCompleteTodo={onCompleteTodo}
          />
        ))
      }

      {
        isLoading && (
          <AddingTodoItem
            title={todoTitle}
          />
        )
      }
    </section>
  );
});
