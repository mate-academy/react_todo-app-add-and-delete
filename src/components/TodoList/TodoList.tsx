import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  deleteTodo,
  tempTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          loading={deletingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          toggleTodo={() => {}}
          deleteTodo={() => {}}
          loading={true}
        />
      )}
    </section>
  );
};
