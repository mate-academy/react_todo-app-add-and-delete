import { Todo } from '../types/Todo';
import { TodoUser } from './TodoUser';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  handleCompletedStatus: (id: number) => void;
  processedIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  handleCompletedStatus,
  processedIds,
}) => {
  const TodoItem = (todo: Todo) => (
    <TodoUser
      key={todo.id}
      todo={todo}
      handleCompletedStatus={handleCompletedStatus}
      onDelete={onDelete}
      processedId={processedIds}
    />
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(TodoItem)}
      {tempTodo && TodoItem(tempTodo)}
    </section>
  );
};
