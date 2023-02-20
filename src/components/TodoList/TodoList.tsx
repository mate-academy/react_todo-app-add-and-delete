import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoDelete: Todo) => void,
};

export const TodoList:React.FC<Props> = ({
  todos,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        (
          <TodoInfo
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
          />
        )

      ))}
    </section>
  );
};
