import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo?: (todoId: number) => void;
  deletingId?: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo = () => {},
  deletingId = [],
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => onDeleteTodo(todo.id)}
        isDeleting={deletingId.includes(todo.id)}
      />
    ))}

    {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} isTemp={true} />}
  </section>
);
