import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
};

export const TodoAppMain: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} onTodoDelete={onTodoDelete} />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        startingStatus={TodoStatus.Loading}
        onTodoDelete={onTodoDelete}
      />
    )}
  </section>
);
