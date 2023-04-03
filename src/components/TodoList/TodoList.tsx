import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  updateTodo: (id: number, value: string, complete: boolean) => void,
  idTodo: number,
  deleteTodo: (value: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  idTodo,
  deleteTodo,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateTodo={updateTodo}
          idTodo={idTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};
