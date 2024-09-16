import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds?: number[];
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onDeleteTodo = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem
            key={todo.id}
            onloadingTodoIds={loadingTodoIds}
            todo={todo}
            onDelete={onDeleteTodo}
          />
        );
      })}
    </section>
  );
};
