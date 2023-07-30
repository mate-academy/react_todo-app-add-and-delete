/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => Promise<any>;
  isLoading: boolean,
}

export const TodoList: React.FC<Props> = ({ todos, removeTodo, isLoading }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={(todoId: number) => removeTodo(todoId)}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
