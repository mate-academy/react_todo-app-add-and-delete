import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, deleteTodo }) => {
  return (
    <>
      {
        todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
        ))
      }
    </>
  );
};
