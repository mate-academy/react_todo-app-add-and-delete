import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  completeTodo: (todoId: number) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodos: Todo[] | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  completeTodo,
  deleteTodo,
  loadingTodos,
}) => (
  <>
    {todos.map(todo => {
      return (
        <TodoInfo
          todo={todo}
          completeTodo={completeTodo}
          deleteTodo={deleteTodo}
          loadingTodos={loadingTodos}
          key={todo.id}
        />
      );
    })}
  </>
);
