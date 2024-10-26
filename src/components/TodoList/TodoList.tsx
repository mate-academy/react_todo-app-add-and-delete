import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  isNewTodoAdding: boolean;
  loadingTodo: Todo | null;
  todoIdsForRemoving: number[] | null;
  isTodoDeleting: boolean;
  setIsTodoDeleting: (isTodoDeleting: boolean) => void;
  setTodoIdsForRemoving: (id: number[] | null) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isNewTodoAdding,
  loadingTodo,
  todoIdsForRemoving,
  isTodoDeleting,
  setTodoIdsForRemoving,
  setIsTodoDeleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isTodoDeleting={isTodoDeleting}
          setIsTodoDeleting={setIsTodoDeleting}
          todoIdsForRemoving={todoIdsForRemoving}
          setTodoIdsForRemoving={setTodoIdsForRemoving}
        />
      ))}

      {isNewTodoAdding && (
        <TodoItem
          key={loadingTodo!.id}
          todo={loadingTodo!}
          isNewTodoAdding={isNewTodoAdding}
          todoIdsForRemoving={todoIdsForRemoving}
        />
      )}
    </section>
  );
};
