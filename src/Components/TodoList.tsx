import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  completedIds: number[],
  handleDelete: (todoId: number) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  completedIds,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          completedIds={completedIds}
          handleDelete={handleDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          completedIds={completedIds}
          handleDelete={handleDelete}
        />
      )}

    </section>
  );
};
