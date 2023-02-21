import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoDelete: Todo) => void,
  tempTodo: Todo | null
};

export const TodoList:React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
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

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          key={0}
          handleDeleteTodo={handleDeleteTodo}
        />
      ) }
    </section>
  );
};
