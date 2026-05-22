import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteIds: number[];
  onDelete: (todoId: number) => void;
};

export const TodoList = ({
  todos,
  tempTodo,
  deleteIds,
  onDelete,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={deleteIds.includes(todo.id)}
            onDelete={onDelete}
          />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
