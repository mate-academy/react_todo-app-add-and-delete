import { useContext } from 'react';
import { TodosContext } from '../../../../../Context/TodosContext';
import { Status } from '../../../../../types/Status';
import { Todo } from '../../../../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { todos, status, tempTodo } = useContext(TodosContext);

  let filterTodos = todos;

  const activeFilter = filterTodos.filter((todo: Todo) => !todo.completed);
  const completedFilter = filterTodos.filter((todo: Todo) => todo.completed);

  switch (status) {
    case Status.All:
      filterTodos = todos;
      break;

    case Status.Active:
      filterTodos = activeFilter;
      break;

    case Status.Completed:
      filterTodos = completedFilter;
      break;

    default:
      break;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}

      {tempTodo
        && (
          <TodoItem
            isTempTodo
            todo={tempTodo}
            key={tempTodo.id}
          />
        )}

    </section>
  );
};
