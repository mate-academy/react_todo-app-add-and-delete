import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  onDeleteTodo: (value: number) => void;
  todos: Todo[];
  tempTodo: Todo | null;
  loading: boolean;
  isTodoId: number[] | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loading,
  tempTodo,
  isTodoId,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          key={todo.id}
          loading={loading}
          isTodoId={isTodoId}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          loading={loading}
        />
      )}
    </>

  );
};
