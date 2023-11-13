import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={false}
        />
      ))}

      {tempTodo
        && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onDelete={onDelete}
            isLoading
          />
        )}
    </section>
  );
};
