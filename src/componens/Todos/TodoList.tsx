import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  deleteTodo(id: number): void;
  temporaryTodo: Todo | null
};

export const TodoList: React.FC<Props> = ({
  todos, deleteTodo, temporaryTodo,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          deleteTodo={deleteTodo}
        />
      ))}
      {
        temporaryTodo && (
          <TodoItem
            todo={temporaryTodo}
            deleteTodo={deleteTodo}
          />
        )
      }
    </section>
  );
};
