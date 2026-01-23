import { Todo } from '../../types/Todo';
import { TodoListItem } from '../TodoListItem/TodoListItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
