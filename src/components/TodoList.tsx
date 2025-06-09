import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  filteredTodos: Todo[];
  onChange: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  loadingTodos: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  onChange,
  handleDeleteTodo,
  tempTodo,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChange={onChange}
          handleDeleteTodo={handleDeleteTodo}
          loading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          onChange={() => {}}
          handleDeleteTodo={() => {}}
          loading={true}
        />
      )}
    </section>
  );
};
