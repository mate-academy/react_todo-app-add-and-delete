import { FC, Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoBody } from '../TodoBody';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletionIds: number[];
  setDeletionIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  deletionIds,
  setDeletionIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoBody
          key={todo.id}
          todo={todo}
          deletionIds={deletionIds}
          setDeletionIds={setDeletionIds}
        />
      ))}
      {tempTodo && <TodoBody todo={tempTodo} setDeletionIds={setDeletionIds} />}
    </section>
  );
};
