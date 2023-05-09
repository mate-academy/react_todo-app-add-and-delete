import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { TodoItem } from './TodoItem';

type Props = {
  filteringList: Todo[] | null
  setTypeError: (typeError: Errors) => void
  setNotificationError: (notificationError: boolean) => void
  tempTodo: Todo | null;
  todoList: Todo[];
  setTodoList: (todoList: Todo[] | null) => void;
  loadersTodosId: number[] | null;
};

export const Main: React.FC<Props> = ({
  filteringList,
  setTypeError,
  setNotificationError,
  tempTodo,
  todoList,
  setTodoList,
  loadersTodosId,
}) => {
  return (
    <section className="todoapp__main">
      {filteringList?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTypeError={setTypeError}
          setNotificationError={setNotificationError}
          todoList={todoList}
          setTodoList={setTodoList}
          loadersTodosId={loadersTodosId}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setTypeError={setTypeError}
          setNotificationError={setNotificationError}
          todoList={todoList}
          setTodoList={setTodoList}
          loadersTodosId={loadersTodosId}
        />
      )}
    </section>
  );
};
