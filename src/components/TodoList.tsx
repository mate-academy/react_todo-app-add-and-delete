import React, { useMemo } from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  filter: Filter;
  handleCompletedChange: (id: number) => void;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  deletedIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  handleCompletedChange,
  tempTodo,
  deleteTodo,
  deletedIds,
}) => {
  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleCompletedChange={handleCompletedChange}
          deleteTodo={deleteTodo}
          loading={deletedIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          handleCompletedChange={() => {}}
          loading={true}
          deleteTodo={() => {}}
        />
      )}
    </section>
  );
};
