import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  displayedTodos: () => Todo[];
  handleCompletedStatus: (todo: Todo) => void;
  editTodo: Todo | null;
  handleFormSubmitEdited: (
    event: React.FormEvent<HTMLFormElement>,
    editTodo: Todo) => void;
  handleEditTodo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  editTitle: string;
  handleDoubleClick: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
  tempTodo: Todo | null;
  isTempTodo: boolean;
};

export const TodoList : React.FC<TodoListProps> = ({
  displayedTodos,
  handleCompletedStatus,
  editTodo,
  handleFormSubmitEdited,
  handleEditTodo,
  editTitle,
  handleDoubleClick,
  handleDelete,
  tempTodo,
  isTempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {displayedTodos().map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            editTodo={editTodo}
            editTitle={editTitle}
            handleDoubleClick={handleDoubleClick}
            handleDelete={handleDelete}
            handleCompletedStatus={handleCompletedStatus}
            handleFormSubmitEdited={handleFormSubmitEdited}
            handleEditTodo={handleEditTodo}
            isTempTodo={isTempTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          editTodo={editTodo}
          editTitle={editTitle}
          handleDoubleClick={handleDoubleClick}
          handleDelete={handleDelete}
          handleCompletedStatus={handleCompletedStatus}
          handleFormSubmitEdited={handleFormSubmitEdited}
          handleEditTodo={handleEditTodo}
          isTempTodo={isTempTodo}
        />
      )}

      {/* temptodow propsach i todoitem -> map */}
    </section>
  );
};
