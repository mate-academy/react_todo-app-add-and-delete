import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  isLoading:boolean,
};

export const TodoList: React.FC<Props> = ({ todos, isLoading }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
