import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (todoId: number) => Promise<void>,
  isProcessing: boolean,
  deletedTodos: number[],
};

export const TodoList: React.FC<Props> = ({
  todos, deleteTodo, isProcessing, deletedTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isProcessing={isProcessing}
          deletedTodos={deletedTodos}
        />
      ))}
    </section>
  );
};
