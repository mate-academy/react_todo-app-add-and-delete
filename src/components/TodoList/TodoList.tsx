// import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface P {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isDeletingTodoId: number | null;
}

export const TodoList: React.FC<P> = ({
  todos,
  deleteTodo,
  isDeletingTodoId,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
        isDeleting={todo.id === isDeletingTodoId}
      />
    ))}
  </section>
);
