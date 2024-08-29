import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  setTodos: (update: (todos: Todo[]) => Todo[]) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
  isLoadingWhileDelete: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoadingWhileDelete: (isLoading: boolean) => void;
  inputRef: RefObject<HTMLInputElement>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  isLoading,
  setIsLoading,
  setIsLoadingWhileDelete,
  isLoadingWhileDelete,
  inputRef,
  setHasError,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          setErrorMessage={setErrorMessage}
          todo={todo}
          key={todo.id}
          setTodos={setTodos}
          setIsLoading={setIsLoading}
          isLoadingWhileDelete={isLoadingWhileDelete}
          setIsLoadingWhileDelete={setIsLoadingWhileDelete}
          inputRef={inputRef}
          setHasError={setHasError}
        />
      ))}
      {tempTodo && (
        <TodoItem
          setErrorMessage={setErrorMessage}
          todo={tempTodo}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isLoadingWhileDelete={isLoadingWhileDelete}
          setIsLoadingWhileDelete={setIsLoadingWhileDelete}
          inputRef={inputRef}
          setHasError={setHasError}
        />
      )}
    </section>
  );
};

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// {/* This todo is being edited */}
// {/* <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label> */}

//   {/* This form is shown instead of the title and remove button */}
//   <form>
//     <input
//       data-cy="TodoTitleField"
//       type="text"
//       className="todo__title-field"
//       placeholder="Empty todo will be deleted"
//       value="Todo is being edited now"
//     />
//   </form>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// {/* This todo is in loadind state */}
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Todo is being saved now
//   </span>

//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

//   {/* 'is-active' class puts this modal on top of the todo */}
//   <div data-cy="TodoLoader" className="modal overlay is-active">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>
