/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterEnum } from '../../api/todos';

interface TodoListProps {
  visibleTodos: Todo[];
  loading: boolean;
  tempTodo: Todo | null;
  allTodos: Todo[];
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingTodoId: number;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: FilterEnum;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  loading,
  tempTodo,
  allTodos,
  setAllTodos,
  loadingTodoId,
  setLoadingTodoId,
  setLoading,
  setError,
  setErrorMessage,
  selectedFilter,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoItem
        visibleTodos={visibleTodos}
        allTodos={allTodos}
        setAllTodos={setAllTodos}
        loadingTodoId={loadingTodoId}
        setLoadingTodoId={setLoadingTodoId}
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        setErrorMessage={setErrorMessage}
        selectedFilter={selectedFilter}
      />

      {loading && tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed || false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo?.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
