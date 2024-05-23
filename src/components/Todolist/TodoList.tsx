import React from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { FilteredTodos } from '../../utils/FilteredTodos';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedFilter: Status;
  handleDeleteTodo: (id: number) => void;
  loadingTodos: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  selectedFilter,
  handleDeleteTodo,
  loadingTodos,
}) => {
  const filteredTodos = FilteredTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          handleDeleteTodo={() => {}}
        />
      )}
    </section>
  );
};
