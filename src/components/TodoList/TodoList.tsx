import { Todo } from '../../types/Todo';
import { useAppContext } from '../Context/AppContext';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  tempTodo: Todo | null,
};

export const TodoList = ({ tempTodo }: Props) => {
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
          <TodoItem todoInfo={todo} key={todo.id} />
        );
      })}
      {tempTodo && (
        <TodoItem todoInfo={tempTodo} key={tempTodo.id} />
      )}
    </>
  );
};
