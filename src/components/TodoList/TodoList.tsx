import React from 'react';
// import classNames from 'classnames';
import { Todo as TodoInterface } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

interface Props {
  todos: TodoInterface[],
  tempTodo: Omit<TodoInterface, 'userId'> | null,
  handleDelete: (todoId: number) => void,
  selectedTodos: number[],
  // clearCompleted: () => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete = () => { },
  selectedTodos,
  // clearCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({
        title,
        id,
        completed,
      }) => (
        <Todo
          id={id}
          title={title}
          completed={completed}
          key={id}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
          // clearCompleted={clearCompleted}
        />
        // <div
        //   data-cy="Todo"
        //   className={classNames('todo', {
        //     completed,
        //   })}
        //   key={id}
        // >
        //   <label className="todo__status-label">
        //     <input
        //       data-cy="TodoStatus"
        //       type="checkbox"
        //       className="todo__status"
        //       checked={completed}
        //     />
        //   </label>

        //   <span data-cy="TodoTitle" className="todo__title">
        //     {title}
        //   </span>
        //   <button type="button" className="todo__remove" data-cy="TodoDelete">
        //     ×
        //   </button>

        // </div>
      ))}
      {tempTodo
        && (
          // <>
          //   <div
          //     data-cy="Todo"
          //     className={classNames('todo')}
          //   >
          //     <div data-cy="TodoLoader" className="modal overlay is-active">
          //       <div className="modal-background has-background-white-ter" />
          //       <div className="loader" />
          //     </div>

          //     <label className="todo__status-label">
          //       <input
          //         data-cy="TodoStatus"
          //         type="checkbox"
          //         className="todo__status"
          //       />
          //     </label>

          //     <span data-cy="TodoTitle" className="todo__title">
          //       {tempTodo?.title}
          //     </span>
          //     <button
          //       type="button"
          //       className="todo__remove"
          //       data-cy="TodoDelete"
          //     >
          //       ×
          //     </button>

          //   </div>
          // </>
          <>
            <Todo
              id={tempTodo.id}
              title={tempTodo.title}
              completed={tempTodo.completed}
              handleDelete={() => { }}
            />
          </>
        )}
    </section>
  );
};
