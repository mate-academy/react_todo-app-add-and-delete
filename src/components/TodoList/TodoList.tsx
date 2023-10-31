import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  filteredTodos: Todo[];
  todos: Todo[];
  nowLoading: boolean;
  showErrorWithDelay: (errorMessage: string) => void;
  handleCompleted: (elem: number, completed: boolean) => void;
  // USER_ID: 11719;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  setTodos,
  setLoaded,
  filteredTodos,
  todos,
  nowLoading,
  showErrorWithDelay,
  handleCompleted,
  // USER_ID,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          todo={todo}
          setTodos={setTodos}
          setLoaded={setLoaded}
          todos={todos}
          nowLoading={nowLoading}
          showErrorWithDelay={showErrorWithDelay}
          handleCompleted={handleCompleted}
          // USER_ID={USER_ID}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setTodos={setTodos}
          setLoaded={setLoaded}
          todos={todos}
          nowLoading={nowLoading}
          showErrorWithDelay={showErrorWithDelay}
          handleCompleted={handleCompleted}
          // USER_ID={USER_ID}
        />
      )}
    </section>
  );
};
