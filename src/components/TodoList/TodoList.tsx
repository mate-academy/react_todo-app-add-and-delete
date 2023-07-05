import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/todo';

interface Props {
  todos: Todo[];
  onDelete: CallableFunction;
  loadingTodoIds: number[];
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoIds,
  tempTodo,
}) => (

  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingTodoIds={loadingTodoIds}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        loadingTodoIds={loadingTodoIds}
        onDelete={onDelete}
      />
    )}
  </section>
);
