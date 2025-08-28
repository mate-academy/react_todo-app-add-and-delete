import { FC } from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo?: (id: number) => void;
  isTodoTemp?: boolean;
  loadingIds?: number[];
};

export const TodoList: FC<Props> = ({
  todos,
  onDeleteTodo,
  isTodoTemp,
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
            isTodoTemp={isTodoTemp}
            isLoadingTodo={isLoadingTodo}
          />
        );
      })}
    </section>
  );
};
