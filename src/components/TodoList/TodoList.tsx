import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodo: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  onToggleComplete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  onDeleteTodo,
  tempTodo,
  onToggleComplete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onToggleComplete={onToggleComplete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => Promise.resolve()}
          isTemp={true}
          onToggleComplete={() => {}}
        />
      )}
    </section>
  );
};
