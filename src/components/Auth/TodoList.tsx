import React, { Dispatch, SetStateAction } from 'react';
// import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, editTodo } from '../../api/todos';
import { TodoItem } from './TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  getTodosFromServer: () => Promise<void>;
  isAdding: boolean;
  tempTodo: Todo;
  setHasError: (isError: boolean) => void;
  setMessageError: (message: ErrorMessage) => void;
  setIsLoading: Dispatch<SetStateAction<number[]>>;
  isLoading: number[];
  // <SetStateAction<ErrorMessage>>;
  // handleDeleteTodo: (id: number) => void;
  // handleEditTodo: (id: number, comleted: boolean) => void;
  // isCompleted:boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  getTodosFromServer,
  isAdding,
  tempTodo,
  setHasError,
  setMessageError,
  setIsLoading,
  isLoading,
}) => {
  // const [isCompleted, setIsCompleted] = useState(false);

  const handleEditTodo = async (id: number, completed: boolean) => {
    // const changeComplted =
    // !comleted;
    try {
      setIsLoading((currentIds) => [...currentIds, id]);
      // setIsCompleted(!isCompleted);
      await editTodo(id, { completed });
      await getTodosFromServer();
      setIsLoading((currentIds) => currentIds
        .filter((numberOfId) => numberOfId !== id));
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.UpdateError);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setIsLoading((currentIds) => [...currentIds, id]);
      await deleteTodo(id);
      await getTodosFromServer();
      setIsLoading((currentIds) => currentIds
        .filter((numberOfId) => numberOfId !== id));
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.DeleteError);
    }
  };

  const handleEditTitle = async (id: number, title: string) => {
    try {
      setIsLoading((currentIds) => [...currentIds, id]);
      await editTodo(id, { title });
      await getTodosFromServer();
      setIsLoading((currentIds) => currentIds
        .filter((numberOfId) => numberOfId !== id));
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.UpdateError);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        // const { completed, id, title } = todo;
        // const { completed, id, title } = todo;

        return (
          <TodoItem
            // todo={todo}
            handleEditTodo={handleEditTodo}
            handleDeleteTodo={handleDeleteTodo}
            // isCompleted={isCompleted}
            todo={todo}
            isLoading={isLoading}
            isAdding={isAdding}
            handleEditTitle={handleEditTitle}
            // completed={todo.completed}
            // id={todo.id}
            // title={todo.title}
          />
        );
      })}
      {isAdding && (
        <TodoItem
          handleEditTodo={handleEditTodo}
          handleDeleteTodo={handleDeleteTodo}
          // isCompleted={isCompleted}
          todo={tempTodo}
          isLoading={isLoading}
          isAdding={isAdding}
          handleEditTitle={handleEditTitle}
        />
      )}
      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          CSS
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
        >
          ×
        </button>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue="JS"
          />
        </form>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          React
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
        >
          ×
        </button>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          Redux
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
        >
          ×
        </button>
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

    </div>  */}
    </section>
  );
};
