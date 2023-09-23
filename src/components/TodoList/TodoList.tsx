import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TempoTodoItem } from '../TempTodoItem/TempTodoItem';

type Props = {
  todos: Todo[],
  tempoTodo: Todo | null;
  deleteTodo: (todoId: number) => void,
  isCompliteDeleting: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos, deleteTodo, tempoTodo, isCompliteDeleting,
}) => (
  <section
    className="todoapp__main"
    data-cy="TodoList"
  >
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={deleteTodo}
        isCompliteDeleting={isCompliteDeleting}
      />
    ))}
    {tempoTodo !== null && (
      <TempoTodoItem tempoTodo={tempoTodo} key={tempoTodo.id} />
    )}
  </section>
);
