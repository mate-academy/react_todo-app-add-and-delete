import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  deleteTodo?: (todoId: number) => void;
  isAdding?: boolean;
  processingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo = null,
  deleteTodo,
  isAdding,
  processingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        processingTodoIds={processingTodoIds}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        isAdding={isAdding}
        processingTodoIds={processingTodoIds}
      />
    )}
  </section>
);
