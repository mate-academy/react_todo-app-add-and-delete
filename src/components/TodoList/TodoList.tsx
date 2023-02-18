import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
  loadingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  loadingTodoIds,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        handleDeleteTodo={handleDeleteTodo}
        loadingTodoIds={loadingTodoIds}
      />
    ))}
  </section>
);
