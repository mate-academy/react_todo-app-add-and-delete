import { Todo } from '../../../types/Todos';
import { TempTodo } from '../../TempTodo/TempTodo';
import { TodoItem } from '../../Todo/Todo';

interface Props {
  filterBy: string | null;
  filtredTodos: (filterQuery: string | null) => Todo[];
  deleteTodo: (id: number) => void;
  processingIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  filterBy,
  filtredTodos,
  deleteTodo,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos(filterBy).map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todo={todoItem}
          deleteTodo={deleteTodo}
          processingIds={processingIds}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
