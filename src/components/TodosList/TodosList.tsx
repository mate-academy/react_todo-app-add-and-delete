/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo as Todos } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: Todos[] | undefined | null;
  handleDelete: (id: number[]) => void;
  todosToDelete: number[];
};

export const TodosList: React.FC<Props> = ({
  todos,
  handleDelete,
  todosToDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          handleDelete={handleDelete}
          toDelete={todosToDelete.includes(todo.id)}
        />
      ))}
    </section>
  );
};
