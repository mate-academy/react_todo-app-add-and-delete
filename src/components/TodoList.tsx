import { useContext, useMemo } from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { TodoItem } from './Todo';

type Props = {
  todos: Todo[];
  status: Status;
  isAdding: boolean;
  curTitle: string,
  onDelete: (id: number) => void,
  loadingTodosIds: number[]
};

export const TodoList: React.FC<Props> = ({
  todos,
  status,
  isAdding,
  loadingTodosIds,
  curTitle,
  onDelete,
}) => {
  const user = useContext(AuthContext);
  const getVisibleTodos = useMemo((): Todo[] => {
    return todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return todos;
      }
    });
  }, [todos, status]);

  const visibleTodos = getVisibleTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
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
