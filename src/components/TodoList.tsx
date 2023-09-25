import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  processingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = (
  { todos, processingIds, onDelete },
) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            processingIds={processingIds}
          />
        ))
      }
    </section>
  );
};
