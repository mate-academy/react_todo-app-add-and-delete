import { useContext } from 'react';
import { Filter } from '../../types/enums/Filter';
import { TodoItem } from '../TodoItem/TodoItem';
import { StateContext } from '../../TodosContext';

interface Props {
  updateTodos: () => void
}

export const TodoList: React.FC<Props> = ({ updateTodos }) => {
  const { todos, filter, tempTodo } = useContext(StateContext);

  const filteredTodos = todos?.filter(todo => {
    switch (filter) {
      case Filter.All:
        return true;

      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        filteredTodos && (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateTodos={updateTodos}
            />
          ))
        )
      }
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          load={!!tempTodo}
          updateTodos={updateTodos}
        />
      ) }
    </section>
  );
};
