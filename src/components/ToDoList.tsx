import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './ToDoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (userId: number) => void;
  todosAreLoadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  todosAreLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          todosAreLoadingIds={todosAreLoadingIds}
        />
      ))}
      {tempTodo && <TempTodo tempTitle={tempTodo.title} />}
    </section>
  );
};
