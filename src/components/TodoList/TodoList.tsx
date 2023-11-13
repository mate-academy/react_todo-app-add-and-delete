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
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo
        && (
          <TodoItem
            todo={tempTodo}
            onDelete={onDelete}
          />
        )}
    </section>
  );
};
