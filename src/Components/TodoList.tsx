import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type TodoListTypes = {
  todosToShow: Todo[];
  editIndex: number | null;
  editValue: string;
  loadingTodoId: number | null;
  completeTodo: (id: number, completed: boolean) => void;
  updateTodo: (
    id: number,
    title: string,
    e?: React.FormEvent<HTMLFormElement>,
  ) => void;
  deleteTodo: (id: number) => void;
  setEditValue: (value: string) => void;
  onDblClick: (data: { index: number; todo: Todo }) => void;
  tempTodo: Todo | null;
};

const TodoList: React.FC<TodoListTypes> = ({
  todosToShow,
  editIndex,
  editValue,
  loadingTodoId,
  completeTodo,
  updateTodo,
  deleteTodo,
  setEditValue,
  onDblClick,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToShow.map((todo, index) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            editIndex={editIndex}
            editValue={editValue}
            loadingTodoId={loadingTodoId}
            completeTodo={completeTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            setEditValue={setEditValue}
            onDblClick={onDblClick}
          />
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className={`todo`}>
          {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
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
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className={`modal overlay is-active`}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

export default TodoList;
