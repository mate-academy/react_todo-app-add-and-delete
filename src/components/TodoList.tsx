import { Todo } from '../types/Todo';
import { TodoListItem } from './TodoListItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  deletingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          deletingIds={deletingIds}
        />
      ))}
    </section>
  );
};
