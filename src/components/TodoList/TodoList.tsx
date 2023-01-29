import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  temporaryNewTodo: Todo | null,
  showError: (message: string) => void;
  onDeleteTodo: (todoId: number) => void;
  loadingTodosIds: number[];
};

export const TodoList: FC<Props> = React.memo((props) => {
  const {
    todos, temporaryNewTodo, onDeleteTodo, loadingTodosIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          loadingTodosIds={loadingTodosIds}
        />
      ))}

      {temporaryNewTodo && (
        <TodoItem
          todo={temporaryNewTodo}
          onDelete={onDeleteTodo}
          loadingTodosIds={loadingTodosIds}
        />
      )}
    </section>
  );
});
