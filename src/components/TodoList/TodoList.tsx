import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  curTitle: string,
  onDelete: (id: number) => void,
  loadingTodosIds: number[]
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    onDelete,
    loadingTodosIds,
    isAdding,
    curTitle,
  } = props;

  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodosIds.includes(todo.id)}
        />
      ))}

      {isAdding && user && (
        <TodoItem
          todo={{
            id: 0,
            title: curTitle,
            completed: false,
            userId: user?.id,
          }}
          onDelete={onDelete}
          isLoading
        />
      )}
    </section>
  );
};
