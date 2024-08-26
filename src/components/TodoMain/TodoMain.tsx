/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  toggleStatus: (todoId: number) => void;
};

export const TodoMain: React.FC<Props> = ({
  todos,
  removeTodo,
  toggleStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          toggleStatus={toggleStatus}
          key={todo.id}
        />
      ))}
    </section>
  );
};
