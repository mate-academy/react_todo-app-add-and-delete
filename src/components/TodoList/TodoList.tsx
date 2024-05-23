import React from 'react';

import './TodoList.scss';
import { Props } from './Props';
import { TodoItem } from '../TodoItem/TodoItem';

// eslint-disable-next-line react/display-name
export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodos,
}) => (
  <section className="todolist todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isLoading={loadingTodos.includes(todo.id)}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        onDelete={onDelete}
        isLoading={loadingTodos.includes(0)}
      />
    )}
  </section>
);
