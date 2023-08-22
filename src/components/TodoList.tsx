import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete = () => {} }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed === true,
          })}
        >
          <TodoItem
            todo={todo}
            onDelete={onDelete}
          />
        </div>
      ))}
    </section>

  );
};
