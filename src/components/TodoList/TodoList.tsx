import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  loadingTodosId: number[],
};

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    onDelete,
    loadingTodosId,
  } = props;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loadingTodosId={loadingTodosId}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          onDelete={onDelete}
          loadingTodosId={loadingTodosId}
        />
      )}
    </section>
  );
};
