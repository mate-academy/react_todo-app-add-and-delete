import { Todo } from '../types/typedefs';
import { useTodos } from '../hooks/useTodos';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../api/todosMethods';

interface TodoCardProps {
  todoListState: ReturnType<typeof useTodos>;
  todo: Todo;
  loadingTodoId: number | null;
  setLoadingTodoId: (id: number | null) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todoListState,
  todo,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  const { showError } = todoListState;
  const isLoadingThisTodo = loadingTodoId === todo.id;
  const isTemp = todo.id === 0;

  const handleToggleSelectedTodo = async (todoId: number) => {
    const updatedTodos = todoListState.todos.map(td =>
      td.id === todoId ? { ...td, completed: !td.completed } : td,
    );

    todoListState.setTodos(updatedTodos);

    try {
      setLoadingTodoId(todoId);
      const todoCard = updatedTodos.find(td => td.id === todoId);

      if (!todoCard) {
        throw new Error('Todo not found');
      }

      await updateTodo(todoId, { completed: todoCard.completed });
    } catch (error) {
      showError('Unable to update todos');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodoId(todoId);
      await deleteTodo(todoId);

      const toDoAfterDelete = todoListState.todos.filter(
        td => td.id !== todoId,
      );

      todoListState.setTodos(toDoAfterDelete);
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleSelectedTodo(todo.id)}
          aria-label="todostatus-label"
          disabled={isLoadingThisTodo || isTemp}
        />
      </label>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTemp || isLoadingThisTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
        disabled={isLoadingThisTodo || isTemp}
      >
        ×
      </button>
    </div>
  );
};
