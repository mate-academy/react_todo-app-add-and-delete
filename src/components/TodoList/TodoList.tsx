import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  processedIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  processedIds,
}) => (
  <>
    {todos.map((todo: Todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={deleteTodo}
        processedIds={processedIds}
      />
    ))}

    {tempTodo
      && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          processedIds={processedIds}
        />
      )}
  </>
);
