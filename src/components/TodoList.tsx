import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  loadingIds: number[];
  handleToggleTodo: (todoId: number) => void;
  onDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    loadingIds,
    handleToggleTodo,
    onDeleteTodo,
    tempTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingIds.includes(todo.id)}
          handleToggleTodo={handleToggleTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading
          handleToggleTodo={handleToggleTodo}
        />
      )}
    </section>
  );
};
