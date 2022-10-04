import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[],
  handleDelete: (todoId: number) => void
  selectedTodos: number[],
  setSelectTodos: (userId: number[]) => void;
};

export const TodoList:React.FC<Props> = ({
  todos,
  handleDelete,
  selectedTodos,
  setSelectTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
          setSelectTodos={setSelectTodos}
        />
      ))}
    </section>
  );
};
