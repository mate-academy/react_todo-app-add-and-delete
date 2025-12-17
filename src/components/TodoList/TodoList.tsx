import React, { useMemo } from 'react';
import { StatusTypes } from '../../enums/StatusTypes';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  statusFilter: StatusTypes;
  loading: boolean;
};

export const TodoList: React.FC<Props> = ({ todos, statusFilter, loading }) => {
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
        <TodoItem todo={todo} loading={loading} key={todo.id} />
      ))}
    </section>
  );
};
