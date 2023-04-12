import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterType } from '../../types/FilterType';
import { getFilteredTodos } from '../../utils/helpers';

type Props = {
  todos: Todo[]
  activeTodos: number
  filterType: FilterType
  tempTodo: Todo | undefined,
  isWaitingForDelte: number,
  removeTodo: (id: number) => void
  isDeletingCompleted: boolean
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterType,
  tempTodo,
  removeTodo,
  isWaitingForDelte,
  isDeletingCompleted,
}) => {
  const visibleTodos = getFilteredTodos(todos, filterType);

  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            isWaitingForDelte={isWaitingForDelte}
            isDeletingCompleted={isDeletingCompleted}
          />
        ))}
        {tempTodo && (
          <TodoItem
            removeTodo={removeTodo}
            todo={tempTodo}
            isWaitingForDelte={isWaitingForDelte}
            isDeletingCompleted={isDeletingCompleted}
          />
        )}
      </section>
    </>
  );
};
