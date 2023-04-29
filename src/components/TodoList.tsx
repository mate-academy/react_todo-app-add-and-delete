import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onRemove: (userId: number) => void;
  onDeleting: boolean;
  todosTransform: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onDeleting,
  todosTransform,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemove={onRemove}
          onDeleting={onDeleting}
          todosTransform={todosTransform}
        />
      ))}
    </section>
  );
};
