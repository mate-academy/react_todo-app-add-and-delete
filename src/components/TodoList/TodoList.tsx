import { useEffect, useState } from 'react';
import { SelectedStatus, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  status: SelectedStatus;
  onCheckTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  onErrorMessage: (error: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  status,
  onCheckTodo,
  tempTodo,
  onDeleteTodo,
  onErrorMessage,
}) => {
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);

  function filterSelectedTodos() {
    let filteredTodos: Todo[] = [];

    if (status === SelectedStatus.all) {
      setSelectedTodos(todos);

      return;
    }

    if (status === SelectedStatus.active) {
      filteredTodos = todos.filter(todo => !todo.completed) || [];
    }

    if (status === SelectedStatus.completed) {
      filteredTodos = todos.filter(todo => todo.completed) || [];
    }

    setSelectedTodos(filteredTodos);
  }

  useEffect(filterSelectedTodos, [todos, status]);

  if (selectedTodos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {selectedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onCheckTodo={onCheckTodo}
            onDeleteTodo={onDeleteTodo}
            onErrorMessage={onErrorMessage}
          />
        ))}

        {/* This todo is in loadind state */}
        {tempTodo && (
          <div data-cy="Todo" className="todo">
            {/* eslint-disable-next-line */}
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

            {/* 'is-active' class puts this modal on top of the todo */}
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};
