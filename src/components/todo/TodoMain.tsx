import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  usingTodos: Todo[];
  processings: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  tempTodo: Todo | null;
};

export const TodoMain: React.FC<Props> = ({
  usingTodos,
  processings,
  onDelete,
  onToggle,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {usingTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processings.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onToggle={() => onToggle(todo)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessed={true}
          onDelete={() => {}}
          onToggle={() => {}}
          dataCy="Todo"
        />
      )}
    </section>
  );
};
