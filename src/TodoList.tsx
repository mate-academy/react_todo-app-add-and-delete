import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  clearCompleted: boolean;
  handleCheckboxChange: (todoId: number) => void;
  handleDelete: (todoId: number) => void;
  loading: boolean;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  clearCompleted,
  handleCheckboxChange,
  handleDelete,
  loading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          clearCompleted={clearCompleted}
          handleCheckboxChange={handleCheckboxChange}
          handleDelete={handleDelete}
          loading={loading}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          clearCompleted={clearCompleted}
          handleCheckboxChange={handleCheckboxChange}
          handleDelete={handleDelete}
          loading={loading}
        />
      )}
    </section>
  );
};
