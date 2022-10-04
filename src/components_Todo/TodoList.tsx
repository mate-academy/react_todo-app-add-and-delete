import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[] | null;
  statusPatch: string;
  setStatusPatch: (event: string) => void;
  handleClickDelete: (event: number) => void;
  isAdding: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  statusPatch,
  setStatusPatch,
  handleClickDelete,
  isAdding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos && (todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          statusPatch={statusPatch}
          setStatusPatch={setStatusPatch}
          handleClickDelete={handleClickDelete}
          isAdding={isAdding}
        />
      )))}
    </section>

  );
};
