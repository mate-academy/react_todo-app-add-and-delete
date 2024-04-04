import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  deletedTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDeleteTodo,
  tempTodo,
  deletedTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          deletedTodoIds={deletedTodoIds}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
