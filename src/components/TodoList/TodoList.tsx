import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isLoader: boolean,
  deleteTodo: (value: number) => void,
  isIdDelete: number | null,
  arryDelete: number[] | null,
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  isLoader,
  deleteTodo,
  isIdDelete,
  arryDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoader={isLoader}
          deleteTodo={deleteTodo}
          isIdDelete={isIdDelete}
          arryDelete={arryDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoader={isLoader}
          deleteTodo={deleteTodo}
          isIdDelete={isIdDelete}
          arryDelete={arryDelete}
        />
      )}
    </section>
  );
};
