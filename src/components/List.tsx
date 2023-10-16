import { Todo } from '../types/Todo';
import { Main } from './Main';

type Props = {
  filterTodos: Todo[];
  onTodoDelete: (todoId: number) => void;
  onTodoUpdate: (todo: Todo, newTitle: string) => void;
};

export const List: React.FC<Props> = ({
  filterTodos,
  onTodoDelete,
  onTodoUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {filterTodos.map(todo => (
        <Main
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
          onTodoUpdate={(newTitle) => onTodoUpdate(todo, newTitle)}
        />
      ))}
    </section>

  );
};
