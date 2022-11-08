import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem todo={todo} key={todo.id} />
    ))}

    {isAdding && tempTodo && (
      <TodoItem todo={tempTodo} key={tempTodo.id} />
    )}
  </section>
);
