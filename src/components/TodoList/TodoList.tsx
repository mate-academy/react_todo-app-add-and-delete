import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/FilterBy';
import { TempTodo } from '../../types/TempTodo';
import { TodoItem } from '../Todoitem';

interface Props {
  todos: Todo[]
  filterBy: FilterBy
  tempTodo: null | TempTodo
  onButtonRemove: (id: number) => void
  loadingTodoIds: number[]
}

export const TodoList: React.FC<Props> = ({
  todos,
  filterBy,
  tempTodo,
  onButtonRemove,
  loadingTodoIds,
}) => {
  const setVisibleTodos = useMemo(
    () => {
      return todos.filter((todo: Todo) => {
        switch (filterBy) {
          case FilterBy.active:
            return !todo.completed;

          case FilterBy.completed:
            return todo.completed;

          default:
            return todos;
        }
      });
    }, [todos, filterBy],
  );

  const visibleTodos = setVisibleTodos;

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onButtonRemove={onButtonRemove}
          loadingTodoIds={loadingTodoIds}
        />
      ))}

      {tempTodo !== null && (
        <>
          <TodoItem
            key={tempTodo?.id}
            todo={tempTodo}
            onButtonRemove={onButtonRemove}
            loadingTodoIds={loadingTodoIds}
          />
        </>
      )}
    </section>
  );
};
