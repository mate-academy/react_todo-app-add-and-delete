import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  deleteTodo?: (todoId: number) => void;
  isAdding?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo = null,
  deleteTodo,
  isAdding,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        isAdding={isAdding}
      />
    )}
  </section>
);
