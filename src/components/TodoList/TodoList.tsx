import { Todo } from '../../types/Todo';
import { TodosItem } from '../TodosItem';
import { Error } from '../../types/Error';

type Props = {
  todos: Todo[] | null,
  isLoadAllDelete: boolean,
  tempTodo: Todo | null,
  setErrorsArgument: (argument: Error | null) => void,
  setTodos: (arg: Todo[]) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoadAllDelete,
  tempTodo,
  setErrorsArgument,
  setTodos,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {(todos?.map((todo: Todo) => (
        <TodosItem
          todos={todos}
          setErrorsArgument={setErrorsArgument}
          isLoadAllDelete={isLoadAllDelete}
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
        />
      )))}
      {tempTodo && (
        <TodosItem
          isLoadAllDelete={isLoadAllDelete}
          todo={tempTodo}
          setErrorsArgument={setErrorsArgument}
          todos={todos}
          setTodos={setTodos}
        />
      )}
    </ul>
  );
};
