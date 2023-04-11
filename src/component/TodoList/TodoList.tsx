import React, { useMemo } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { LoadType } from '../../types/LoadType';

type Props = {
  todos: Todo[];
  typeOfLoad: LoadType;
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  typeOfLoad,
  tempTodo,
  onDelete,
}) => {
  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (typeOfLoad) {
      case LoadType.Active:
        return !completed;

      case LoadType.Completed:
        return completed;

      default:
        return true;
    }
  }), [todos, typeOfLoad]);

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={0}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
