/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => Promise<any>;
  loadingIds: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={(todoId: number) => removeTodo(todoId)}
          loadingIds={loadingIds}
        />
      ))}
    </section>
  );
};
