import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  isAdd: boolean;
  isChange: boolean;
  isDelete: boolean;
  tempId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  isAdd,
  isChange,
  isDelete,
  tempId,
  setTodos,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          todos={todos}
          isAdd={isAdd}
          isChange={isChange}
          isDelete={isDelete}
          tempId={tempId}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          key={todo.id}
        />
      ))}
    </section>
  );
};
