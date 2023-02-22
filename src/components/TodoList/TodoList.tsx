import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main">
      <div>
        {todos.map((todo) => {
          return <TodoItem todo={todo} />;
        })}
      </div>
      {!!tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
