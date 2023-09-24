/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<any>;
  isLoading: boolean,
}

export const TodoList: React.FC<Props> = ({ todos, deleteTodo, isLoading }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={(todoId: number) => deleteTodo(todoId)}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
