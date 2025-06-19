import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodosId: number[];
  // onCheck: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodosId,
  // onCheck,
  onDelete,
}) => {
  const newArray = tempTodo ? todos.concat(tempTodo) : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {newArray.map(t => (
        <TodoInfo
          key={t.id}
          todo={t}
          deletingTodosId={deletingTodosId}
          // onCheck={onCheck}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
