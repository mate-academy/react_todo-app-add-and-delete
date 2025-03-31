import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletedTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletedTodos,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletedTodos={deletedTodos}
        />
      ))}
    </>
  );
};
