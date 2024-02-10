import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ todos, setTodos, tempTodo }) => {
  function removeTodo(todoId: number) {
    deleteTodo(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todolist">
        {todos.map((todo: Todo) => (
          <TodoItem
            onDelete={() => removeTodo(todo.id)}
            key={todo.id}
            todo={todo}
          />
        ))}
        {tempTodo === null ? '' : (
          <li data-cy="Todo" className="todo">
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

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </li>

        ) }
      </ul>
    </section>
  );
};
