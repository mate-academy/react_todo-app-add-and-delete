import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import { Errors } from '../../types/ErrorTypes';

type Props = {
  todos: Todo[],
  onCompletionChange: (todoId: number) => void,
  onRemoveTodo: (todoId: number) => void,
  onTodoEdited: (id: number, newTitle: string) => void,
  setErrorMsg: (errorMsg: Errors | null) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = (
  {
    todos, onCompletionChange, onRemoveTodo,
    onTodoEdited, setErrorMsg, tempTodo,
  },
) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos
      .map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onCompletionChange={onCompletionChange}
          onRemoveTodo={onRemoveTodo}
          onTodoEdited={onTodoEdited}
          setErrorMsg={setErrorMsg}
        />
      ))}

    {tempTodo !== null && (
      <div
        data-cy="Todo"
        className={tempTodo.completed ? 'todo completed' : 'todo'}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            readOnly
            checked
          />
        </label>
        <span
          data-cy="TodoTitle"
          className="todo__title"
        >
          { tempTodo.title }
        </span>
        {/* overlay will cover the todo while it is being updated */}
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
