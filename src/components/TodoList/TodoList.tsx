/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../Todo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: Todo['id'][];
  onLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>;
  onHandleDeleteTodo: (todoId: Todo['id']) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  onHandleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          onHandleDeleteTodo={onHandleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          key={tempTodo.id}
          todo={tempTodo}
          loadingTodos={loadingTodos}
          onHandleDeleteTodo={onHandleDeleteTodo}
        />
      )}
    </section>
  );
};
