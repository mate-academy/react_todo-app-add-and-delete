import { Todo } from '../types/Todo';
import { TodoItems } from './TodoItems';

interface Props {
  todos: Todo[],
  loader: boolean,
  removedTodo: (todoId: number) => Promise<unknown>
}

export const TodoList: React.FC<Props> = ({
  todos,
  loader,
  removedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItems
          todo={todo}
          key={todo.id}
          loader={loader}
          removedTodo={(todoId: number) => removedTodo(todoId)}
        />
      ))}

    </section>
  );
};
