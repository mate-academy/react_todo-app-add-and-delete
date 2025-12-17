import React, { useMemo } from 'react';
import { StatusTypes } from '../../enums/StatusTypes';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  loadings: number[];
  tempTodo: Todo | null;
  todos: Todo[];
  statusFilter: StatusTypes;
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  loadings,
  todos,
  statusFilter,
  tempTodo,
  deleteTodo,
}) => {
  const visibleTodos = useMemo(() => {
    return todos.filter(t =>
      statusFilter === StatusTypes.ALL
        ? true
        : statusFilter === StatusTypes.COMPLETED
          ? t.completed
          : !t.completed,
    );
  }, [todos, statusFilter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem
          onDelete={() => deleteTodo(todo.id)}
          todo={todo}
          loading={loadings.includes(todo.id)}
          key={todo.id}
        />
      ))}

      {tempTodo && <TodoItem key={0} todo={tempTodo} loading={true} />}
    </section>
  );
};
