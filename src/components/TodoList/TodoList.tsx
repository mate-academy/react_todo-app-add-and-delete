import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
}) => (
  <>
    {todos.map((todo: Todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
      />
    ))}

    {tempTodo
      && (
        <TodoItem
          todo={tempTodo}
        />
      )}
  </>
);
