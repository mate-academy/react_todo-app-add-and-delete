import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import { FilterType } from '../../types/FilterEnum';

type Props = {
  todos: Todo[];
  filter: FilterType;
  loadingIds: number[];
  onDeleteTodo: (id: number) => void
  onUpdateTodo: (id: number, data: Partial<Todo>) => void,
  temporaryTodo: Todo | undefined;
};

export const ToodList: React.FC<Props> = ({
  todos,
  filter,
  loadingIds,
  onDeleteTodo,
  onUpdateTodo,
  temporaryTodo,
}) => {
  const filteredTodoList: Todo[] = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filter) {
        case FilterType.All:
          return true;

        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  return (
    <>
      <section>
        {filteredTodoList.map((todo: Todo) => {
          const isLoading = loadingIds.some(id => id === todo.id);

          return (
            <TodoInfo
              isLoading={isLoading}
              key={todo.id}
              onUpdate={onUpdateTodo}
              onDelete={onDeleteTodo}
              todo={todo}
            />
          );
        })}
      </section>

      {temporaryTodo && (
        <TodoInfo
          isLoading
          onUpdate={() => {}}
          todo={temporaryTodo}
          key={temporaryTodo.id}
          onDelete={() => {}}
        />
      )}
    </>
  );
};
