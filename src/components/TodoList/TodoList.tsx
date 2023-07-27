/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => Promise<any>;
}

export const TodoList: React.FC<Props> = ({ todos, removeTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={(todoId: number) => removeTodo(todoId)}
        />
      ))}
    </section>
  );
};
