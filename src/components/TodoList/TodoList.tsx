import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[]
  deleteTodoHandler: (todoId: number) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodoHandler,
  tempTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">

    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodoHandler={deleteTodoHandler}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        key={tempTodo.id}
        deleteTodoHandler={deleteTodoHandler}
      />
    )}
  </section>
);
