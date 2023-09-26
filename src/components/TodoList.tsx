import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => void;
  onTodoUpdate: (todo: Todo, newTodoTitle: string) => void;
  todosIdToDelete: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  onTodoUpdate,
  todosIdToDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onTodoDelete={onTodoDelete}
        onTodoUpdate={onTodoUpdate}
        todosIdToDelete={todosIdToDelete}
      />
    ))}
  </section>
);
