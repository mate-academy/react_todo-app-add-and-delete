import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  fetchDeleteTodo: (todoId: number) => void,
  activeTodoId: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  fetchDeleteTodo,
  activeTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          fetchDeleteTodo={fetchDeleteTodo}
          isLoading={activeTodoId.some(id => id === todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          fetchDeleteTodo={fetchDeleteTodo}
          isLoading
        />
      )}
    </section>
  );
};
