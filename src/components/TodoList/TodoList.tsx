import { useMemo, useState } from 'react';
import { Todo, FilterOption } from '../../types';
import { getFilteredTodos } from '../../utils';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  filterOption: FilterOption;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodoIds: number[];
  isNewTodoLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterOption,
  tempTodo,
  onDelete,
  loadingTodoIds,
  isNewTodoLoading,
}) => {
  const [editingTodoId] = useState<number | null>(null);

  const filtredTodos = useMemo(
    () => getFilteredTodos(todos, filterOption),
    [todos, filterOption],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingTodoId === todo.id}
            isLoading={loadingTodoIds.includes(todo.id)}
            onDelete={onDelete}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isEditing={false}
          isLoading={isNewTodoLoading}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
