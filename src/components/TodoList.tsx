/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
  tempTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodoIds,
  tempTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isTemp={todo.id === tempTodoId}
          onDelete={onDelete}
          deletingTodoIds={deletingTodoIds}
        />
      ))}
    </section>
  );
};
