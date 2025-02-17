import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  loadingTodos: number[];
};

export const TodoList = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  loadingTodos,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />
      )}
    </section>
  );
};
