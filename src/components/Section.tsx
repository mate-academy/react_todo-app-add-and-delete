import { SetStateAction, Dispatch } from 'react';
import { TasksFilter } from '../types/tasksFilter';
import { Todo } from '../types/Todo';
import { ErrorMesage } from '../types/ErrorIMessage';
import * as postService from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
  tasksFilter: TasksFilter
  setErrorMessage: Dispatch<SetStateAction<ErrorMesage>>
}

export const Section: React.FC<Props> = ({
  todos,
  setTodos,
  tasksFilter,
  setErrorMessage,
}) => {
  async function deleteData(idToDelete: number) {
    try {
      setTodos(currentTodos => currentTodos
        .filter((currentTodo) => currentTodo.id !== idToDelete));
      await postService.deleteTodo(idToDelete);
    } catch (error) {
      setErrorMessage(ErrorMesage.deletingError);
    }
  }

  let filteringTodos;

  switch (tasksFilter) {
    case TasksFilter.active:
      filteringTodos = todos.filter((todo) => !todo.completed);
      break;

    case TasksFilter.completed:
      filteringTodos = todos.filter((todo) => todo.completed);
      break;
    default:
      filteringTodos = todos;
  }

  const toggleCompleted = (id: number, completed: boolean) => {
    setTodos((currentTodos) => (
      currentTodos.map((currentTodo) => (
        currentTodo.id === id ? (
          { ...currentTodo, completed: !completed }
        ) : (
          currentTodo
        )
      ))
    ));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteringTodos.map(({ title, id, completed }) => (
        <div
          data-cy="Todo"
          className={`todo ${completed ? 'completed' : ''}`}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => toggleCompleted(id, completed)}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteData(id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};
