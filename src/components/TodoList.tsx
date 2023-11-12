import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onUpdateTodos: (todo: Todo) => void,
  tempTodo: Todo | null,
  onDeleteTodo: (id: number) => void,
  deletedIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onUpdateTodos,
  tempTodo,
  onDeleteTodo,
  deletedIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onUpdateTodos={onUpdateTodos}
          onDeleteTodo={onDeleteTodo}
          deletedIds={deletedIds}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
