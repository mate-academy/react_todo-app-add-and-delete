import { useContext } from 'react';
import { TodosContext } from '../../../../../Context/TodosContext';
import { Status } from '../../../../../types/Status';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { todos, status, tempTodo } = useContext(TodosContext);

  const filteredTodos = todos.filter(({ completed }) => {
    switch (status) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
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
