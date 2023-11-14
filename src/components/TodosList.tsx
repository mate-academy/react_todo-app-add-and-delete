import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/TodosFilter';
import * as todosApi from '../api/todos';
import { TodoItem } from './TodoItem';

type Props = {
  currentTodos: Todo[];
  filter: TodosFilter;
  setCurrentTodos: (updatedTodos: Todo[]) => void;
  updatingTodo: boolean;
  newTodo: string;
  setErrorNotification: (errorNotification: string) => void;
};

export const TodoList: React.FC<Props> = ({
  currentTodos,
  filter,
  setCurrentTodos,
  updatingTodo,
  newTodo,
  setErrorNotification,
}) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const filteredTodos = () => {
    switch (filter) {
      case TodosFilter.all:
        return currentTodos;
      case TodosFilter.completed:
        return currentTodos.filter((todo) => todo.completed);
      case TodosFilter.active:
        return currentTodos.filter((todo) => !todo.completed);
      default:
        return currentTodos;
    }
  };

  const handleDeleteCurrentTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);

    try {
      await todosApi.deleteTodos(todoId);

      const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);

      setCurrentTodos(updatedTodos);
    } catch (error) {
      setErrorNotification('Unable to delete a todo');
    } finally {
      setTimeout(() => {
        setDeletingTodoId(null);
      }, 300);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos().map((todo) => (
        <TodoItem
          todo={todo}
          handleDeleteCurrentTodo={handleDeleteCurrentTodo}
          deletingTodoId={deletingTodoId}
        />
      ))}
      {updatingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {newTodo}
          </span>
          {/* Remove button appears only on hover */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
      {/* Additional components for overlays and editing */}
    </section>
  );
};
