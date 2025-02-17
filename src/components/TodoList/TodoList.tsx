import TodoCard from '../TodoCard/TodoCard';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  todosToBeDeleted: number[];
  setTodos: (todos: Todo[] | ((todos: Todo[]) => Todo[])) => void;
  setErrorMessage: (text: string) => void;
  onDeleteTodo: (id: number) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todosToBeDeleted,
  onDeleteTodo,
  setTodos,
  setErrorMessage,
}) => {
  const isTodoTemp = tempTodo !== null;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          isTemp={false}
          todosToBeDeleted={todosToBeDeleted}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoCard
          todo={tempTodo}
          isTemp={isTodoTemp}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          todosToBeDeleted={todosToBeDeleted}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
};

export default TodoList;
