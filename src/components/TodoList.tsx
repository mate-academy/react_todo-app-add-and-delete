import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  loadedTodoId: number[],
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  loadedTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoading = loadedTodoId.some(todoId => todoId === todo.id);

        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            isLoading={isLoading}
          />
        );
      })}

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
