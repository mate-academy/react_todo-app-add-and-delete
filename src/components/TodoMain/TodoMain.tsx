import { LoadingTypes } from '../../types/Loading';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo/TodoInfo';

type Props = {
  filteredTodos: Todo[];
  isLoading: LoadingTypes;
  handleCheckTodo: (id: number) => void;
  handleDeleteTodos: (todoId: number) => void;
};

export const TodoMain: React.FC<Props> = ({
  filteredTodos,
  isLoading,
  handleDeleteTodos,
  handleCheckTodo,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => {
        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            handleCheckTodo={handleCheckTodo}
            handleDeleteTodos={handleDeleteTodos}
            isLoadingTodos={isLoading.todos}
            isLoadingDelete={isLoading.deletedId}
            isLoadingAdd={isLoading.add}
          />
        );
      })}
    </section>
  );
};
