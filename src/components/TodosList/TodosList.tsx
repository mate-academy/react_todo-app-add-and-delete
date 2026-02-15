import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodosListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  processingIds: number[];
};

export const TodosList = ({
  todos,
  filteredTodos,
  tempTodo,
  setProcessingIds,
  processingIds,
}: TodosListProps) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              setProcessingIds={setProcessingIds}
              processingIds={processingIds}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              processingIds={processingIds}
              setProcessingIds={setProcessingIds}
            />
          )}
        </section>
      )}
    </>
  );
};
