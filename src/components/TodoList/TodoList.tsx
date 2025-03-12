/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoItem } from '../TodoItem';

const classNameLoader = 'modal-background has-background-white-ter';

type Props = {
  filteredTodos: Todo[];
  selectedTodo?: Todo;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | undefined>>;
  deleteChosenTodo: (currentTodoToDelete: Todo | null) => void;
  focusedTodoRef: React.RefObject<HTMLInputElement>;
  shouldDeleteCompleted: boolean;
  tempTodo: Todo | null;
  updateChosenTodo: (todoSetToUpdate: Todo | null) => void;
  shouldToggleAllCompleted: boolean;
  currentTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  selectedTodo,
  setSelectedTodo,
  deleteChosenTodo,
  focusedTodoRef,
  shouldDeleteCompleted,
  tempTodo,
  updateChosenTodo,
  shouldToggleAllCompleted,
  currentTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.length !== 0 && (
        <div>
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              deleteChosenTodo={deleteChosenTodo}
              focusedTodoRef={focusedTodoRef}
              shouldDeleteCompleted={shouldDeleteCompleted}
              key={todo.id}
              updateChosenTodo={updateChosenTodo}
              shouldToggleAllCompleted={shouldToggleAllCompleted}
              currentTodos={currentTodos}
            />
          ))}
        </div>
      )}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            'todo completed': tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          {/* overlay will cover the todo while it is being deleted or updated */}

          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className={classNameLoader} />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
