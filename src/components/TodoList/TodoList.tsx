import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
  selectedTodoId: number | null;
  completedTodosId: number[];
  isClearCompleted: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  onDeleteTodo,
  selectedTodoId,
  completedTodosId,
  isClearCompleted,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        isLoading={isLoading && (
          !todo.id
          || selectedTodoId === todo.id
          || (completedTodosId?.includes(todo.id) && isClearCompleted)
        )}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        isLoading={isLoading}
        onDeleteTodo={onDeleteTodo}
      />
    )}
  </section>
);
