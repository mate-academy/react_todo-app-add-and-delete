import { ErrorType, Todo } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  todoList: Todo[];
  filterTodoList: (todoId: number) => void;
  setErrorMessage: (setErrorMessage: ErrorType | null) => void;
}

export const TodoList: React.FC<Props> = ({
  todoList,
  filterTodoList,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          filterTodoList={filterTodoList}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};
