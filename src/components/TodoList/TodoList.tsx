import { TempTodo, Todo } from '../../types/Todo';
import { TodoContent } from '../TodoContent/TodoContent';

type Props = {
  todos: Todo[];
  temporaryTodo: TempTodo | null;
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  temporaryTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoContent
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
        />
      ))}

      {temporaryTodo && (
        <TodoContent
          key={temporaryTodo.id}
          todo={temporaryTodo}
        />
      )}

    </section>
  );
};
