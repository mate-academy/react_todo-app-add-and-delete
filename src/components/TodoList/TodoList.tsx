import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  displayedTodos: () => Todo[];
  tempTodo: Todo | null;
  handleCompletedStatus: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
  handleFormSubmitEdited: (
    event: React.FormEvent<HTMLFormElement>,
    editTodo: Todo) => void;
  idCompleatedArr: number[];
};

export const TodoList : React.FC<TodoListProps> = ({
  displayedTodos,
  tempTodo,
  handleCompletedStatus,
  handleDelete,
  handleFormSubmitEdited,
  idCompleatedArr,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {displayedTodos().map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleCompletedStatus={handleCompletedStatus}
            handleDelete={handleDelete}
            handleFormSubmitEdited={handleFormSubmitEdited}
            idCompleatedArr={idCompleatedArr}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          handleDelete={handleDelete}
          handleFormSubmitEdited={handleFormSubmitEdited}
          idCompleatedArr={idCompleatedArr}
        />
      )}

      {/* temptodow propsach i todoitem -> map */}
    </section>
  );
};
