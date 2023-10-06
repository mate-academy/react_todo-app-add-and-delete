import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo:(todoId:number) => void;
  temporaryTodo: Todo | null;
};

export const TodoList:React.FC<Props> = ({
  todos,
  deleteTodo,
  temporaryTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          deleteTodo={deleteTodo}
        />
      )}

    </section>
  );
};
