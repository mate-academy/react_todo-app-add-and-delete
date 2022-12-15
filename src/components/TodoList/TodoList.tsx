import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (deletingTodoId: number) => void,
  isAdding: boolean,
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, isAdding }) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
        />
      ))}

      {isAdding && (
        <TodoItem
          todo={{
            id: 0,
            title: 'Updating data...',
            completed: false,
            userId: user?.id,
          }}
          onDelete={onDelete}
          isAdding={isAdding}
        />
      )}
    </section>
  );
};
