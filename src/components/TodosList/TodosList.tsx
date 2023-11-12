import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todos: Todo[];
};

export const TodosList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}
      <TodoLoader />
    </section>
  );
};
