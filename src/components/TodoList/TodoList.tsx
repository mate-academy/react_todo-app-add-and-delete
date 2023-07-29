import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[] | null,
  removeTodo: (vatodoIdlue: number) => void,
};

export const TodoList:React.FC<Props> = ({ todos, removeTodo }) => {
  return (
    <>
      {todos?.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
        />
      ))}
    </>
  );
};
