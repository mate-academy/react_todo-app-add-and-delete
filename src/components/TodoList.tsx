import { Todo } from '../types';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loading: boolean;
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo, loading }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loading={loading && todo.completed}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        loading
      />
    )}
  </section>
);
