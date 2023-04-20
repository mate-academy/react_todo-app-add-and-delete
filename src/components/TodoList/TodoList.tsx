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
  <ul>
    {todos.map((todo: Todo) => (
      <li>
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          processedIds={processedIds}
        />
      </li>
    ))}

    {tempTodo
      && (
        <li>
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
            processedIds={processedIds}
          />
        </li>
      )}
  </ul>
);
