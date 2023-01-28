import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  onDeleteTodo: (id: number) => void
  deletingTodosIds: number[]
  tempTodo: Todo | null
};

export const TodoList: FC<Props> = memo(({
  todos, onDeleteTodo, deletingTodosIds, tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isDelete={deletingTodosIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
});
