import { SelectedStatus, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  status: SelectedStatus;
  onCheckTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  onErrorMessage: (error: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  status,
  onCheckTodo,
  tempTodo,
  onDeleteTodo,
  onErrorMessage,
}) => {
  let filteredTodos: Todo[] = [];

  if (status === SelectedStatus.all) {
    filteredTodos = todos;
  } else if (status === SelectedStatus.active) {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (status === SelectedStatus.completed) {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  if (filteredTodos.length === 0) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onCheckTodo={onCheckTodo}
          onDeleteTodo={onDeleteTodo}
          onErrorMessage={onErrorMessage}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onCheckTodo={onCheckTodo}
          onDeleteTodo={onDeleteTodo}
          onErrorMessage={onErrorMessage}
        />
      )}
    </section>
  );
};
