import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onTodoDelete: (selectedTodoId: number) => void,
  tempTodo: Todo | null,
  loadingTodosIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  tempTodo,
  loadingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
          loadingTodosIds={loadingTodosIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
