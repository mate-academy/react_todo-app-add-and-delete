import { FC } from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo?: (id: number) => void;
  tempTodo?: Todo | null;
  loadingIds?: number[];
};

export const TodoList: FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoadingTodo = loadingIds?.includes(todo.id) ?? false;

        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
            isLoadingTodo={isLoadingTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isTodoTemp={true}
          isLoadingTodo={loadingIds?.includes(tempTodo.id) ?? false}
        />
      )}
    </section>
  );
};
