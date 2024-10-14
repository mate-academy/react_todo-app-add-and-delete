import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from '../components/TodoItem';
import { TodoStatus, getFilteredTodos } from '../utils/getFilteredTodos';

type Props = {
  todos: Todo[];
  status: TodoStatus;
  handleDeletingTodo: (id: number) => void;
  tempTodo: Todo | null;
  managingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  status,
  handleDeletingTodo,
  tempTodo,
  managingTodos,
}) => {
  const filteredTodos = getFilteredTodos(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeletingTodo={handleDeletingTodo}
          isLoading={managingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeletingTodo={() => {}}
          isLoading={managingTodos.includes(0)}
        />
      )}
    </section>
  );
};
