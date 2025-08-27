import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onTodoDelete={onTodoDelete} />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onTodoDelete={onTodoDelete}
        />
      )}
    </section>
  );
};
