import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodo: Todo[];
  deleteCurrentTodo: (id: number) => void;
  deleteTodoId: number | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  deleteCurrentTodo,
  deleteTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(({ title, completed, id }) => (
        <TodoItem
          title={title}
          completed={completed}
          key={id}
          id={id}
          loader={deleteTodoId === id}
          deleteCurrentTodo={deleteCurrentTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={tempTodo.completed}
          id={tempTodo.id}
          deleteCurrentTodo={deleteCurrentTodo}
          loader
        />
      )}
    </section>
  );
};
