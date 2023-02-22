import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main">
      <div>
        {todos.map((todo) => {
          return <TodoItem todo={todo} />;
        })}
      </div>
    </section>
  );
};
