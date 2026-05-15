import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  loadingIds: number[];
  onChecked: (obj: Todo) => void
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, loadingIds, onChecked }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteItem={onDelete}
          isLoading={loadingIds.includes(todo.id)}
          isComplete={onChecked}
        />
      ))}
    </section>
  );
};
