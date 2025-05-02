/* eslint-disable prettier/prettier */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeletTodo: (deleteTodo: Todo) => void;
  handleChecked: (checkedTodo: Todo) => void;
  loadingIds: number[];
  isLoadingAll: boolean;
};

export const TodosList: React.FC<Props> = ({
  todos,
  handleDeletTodo,
  handleChecked,
  loadingIds,
  isLoadingAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {isLoadingAll
        ? todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeletTodo={handleDeletTodo}
            handleChecked={handleChecked}
            loadingIds={todos.map(currentTodo => currentTodo.id)}
          />
        ))
        : todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeletTodo={handleDeletTodo}
            handleChecked={handleChecked}
            loadingIds={loadingIds}
          />
        ))}
    </section>
  );
};
