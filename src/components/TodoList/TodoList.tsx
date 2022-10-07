import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedIds: number[],
  isAdding: boolean,
  title: string
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedIds,
  isAdding,
  title,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          selectedIds={selectedIds}
          isAdding={isAdding}
        />
      ))}

      {isAdding && (
        <TodoItem
          todo={{
            id: 0,
            title,
            completed: false,
            userId: Math.random(),
          }}
          removeTodo={removeTodo}
          selectedIds={selectedIds}
          isAdding={isAdding}
        />
      )}
    </section>
  );
};
