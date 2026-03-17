import { Todo } from './Todo';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (id: number) => void;
  deletingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingIds,
}) => {
  return (
    <>
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={deletingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <Todo key={tempTodo.id} todo={tempTodo} onDelete={onDelete} isLoading />
      )}
    </>
  );
};
