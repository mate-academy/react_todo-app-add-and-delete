import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = (props) => {
  const { todos, tempTodo, deleteTodo } = props;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={deleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={0}
          onDelete={deleteTodo}
        />
      )}
    </section>
  );
};
