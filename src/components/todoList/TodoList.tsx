import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todoList: Todo[];
  todoTemp: Todo | null;
  deleteTodo: (postId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  todoTemp,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem todo={todo} key={todo.id} deleteTodo={deleteTodo} />
      ))}

      {/* todoTemp з'являється, коли йде загрузка запиту на додавання todo до серверу */}
      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          key={todoTemp.id}
          deleteTodo={deleteTodo}
          tempLoader={true}
        />
      )}
    </section>
  );
};
