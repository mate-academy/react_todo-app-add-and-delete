// import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface P {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isLoadingTodoId: number | null;
}

export const TodoList: React.FC<P> = ({
  todos,
  deleteTodo,
  isLoadingTodoId,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
        isLoading={todo.id === isLoadingTodoId}
      />
    ))}
  </section>
);
