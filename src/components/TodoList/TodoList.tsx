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
  <ul className="todoapp__todolist">
    {todos.map((todo: Todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDeleteTodo={deleteTodo}
        processedIds={processedIds}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        onDeleteTodo={deleteTodo}
        processedIds={processedIds}
      />
    )}
  </ul>
);
