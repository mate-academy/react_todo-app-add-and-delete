import { FC, memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './Todo';

interface Props {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  isDeleting: number[],
  onDelete: (id: number) => void,
}

export const TodoList: FC<Props> = memo(
  ({
    visibleTodos,
    tempTodo,
    isDeleting,
    onDelete,
  }) => (
    <section className="todoapp__main" data-cy="TodoList">
      {
        visibleTodos
          .map((todo) => (
            <TodoComponent
              key={todo.id}
              todo={todo}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          ))
      }

      {
        tempTodo && (
          <TodoComponent
            todo={tempTodo}
            isDeleting={isDeleting}
            onDelete={onDelete}
          />
        )
      }
    </section>
  ),
);
