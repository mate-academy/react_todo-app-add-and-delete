import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  preparedTodos: Todo[],
  tempTodo: Todo | null,
  deleteCurrentTodo: (todoId: number) => Promise<void>,
  onDeleteIds: number[] | null,
  setOnDeleteIds: React.Dispatch<React.SetStateAction<number[] | null>>,
};

export const TodoList: React.FC<Props> = memo(({
  preparedTodos,
  tempTodo,
  deleteCurrentTodo,
  onDeleteIds,
  setOnDeleteIds,
}) => {
  const handleClickRemove = (todoId: number) => {
    setOnDeleteIds([todoId]);

    deleteCurrentTodo(todoId)
      .finally(() => setOnDeleteIds(null));
  };

  return (
    <section className="todoapp__main">
      {preparedTodos.map(todo => (
        <TodoItem
          todo={todo}
          onDeleteIds={onDeleteIds}
          handleClickRemove={handleClickRemove}
        />
      ))}

      {!!tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
});
