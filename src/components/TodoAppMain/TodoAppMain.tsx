import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
  onTodoCheck: (todo: Todo) => void;
};

export const TodoAppMain: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoCheck,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        onTodoCheck={onTodoCheck}
        key={todo.id}
        todo={todo}
        onTodoDelete={onTodoDelete}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        startingStatus={TodoStatus.Loading}
        onTodoDelete={onTodoDelete}
        onTodoCheck={onTodoCheck}
      />
    )}
  </section>
);
