import React from 'react';
import { Todo } from '../../types/Todo/Todo';
import { TodoUser } from '../TodoUser/TodoUser';

interface Props {
  todos: Todo[];
  loading: number[] | null;
  onDelete?: (id: number[]) => void;
  tempTodo: Todo | null;
  onEdit: (id: number, data: Partial<Todo>) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  onDelete,
  tempTodo,
  onEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoUser
          todo={todo}
          key={todo.id}
          loading={loading}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      {tempTodo && (
        <TodoUser
          todo={tempTodo}
          key={tempTodo.id}
          loading={loading}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </section>
  );
};
