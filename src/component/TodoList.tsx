import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  toggleTodo: (id: number) => void;
  handleDelete: (id: number) => void;
  loadingTodoId: number[];
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  toggleTodo,
  handleDelete,
  loadingTodoId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        toggleTodo={toggleTodo}
        handleDelete={handleDelete}
        loadingTodoId={loadingTodoId}
      />
    ))}
  </section>
);
