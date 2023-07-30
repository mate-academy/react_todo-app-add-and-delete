import { Todo } from '../../types/Todo';
import { useAppContext } from '../Context/AppContext';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList = () => {
  const {
    todos,
    filterType,
  } = useAppContext();

  const preparedTodos = [...todos]
    .filter((todo) => {
      switch (filterType) {
        case 'active': return !todo.completed;
        case 'completed': return todo.completed;
        default: return todo;
      }
    });

  return (
    <>
      {preparedTodos.map((todo: Todo) => {
        return (
          <TodoItem todoInfo={todo} />
        );
      })}
    </>
  );
};
