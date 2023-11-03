import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (id: number) => void,
  loadingItems: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  loadingItems,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo:Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          isLoading={loadingItems.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          isLoading
        />
      )}
    </section>
  );
};
