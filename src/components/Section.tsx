import { SetStateAction, Dispatch } from 'react';
import { TasksFilter } from '../types/tasksFilter';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
  tasksFilter: TasksFilter
  setErrorId: Dispatch<SetStateAction<number>>
}

export const Section: React.FC<Props> = ({
  todos,
  setTodos,
  tasksFilter,
  setErrorId,
}) => {
  async function deleteData(idToDelete: number) {
    try {
      setTodos(currentTodos => currentTodos
        .filter((currentTodo) => currentTodo.id !== idToDelete));
      await postService.deleteTodo(idToDelete);
    } catch (error) {
      setErrorId(3);
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
              onChange={() => setTodos((currentTodos) => {
                return currentTodos.map((currentTodo) => {
                  return currentTodo.id === id
                    ? { ...currentTodo, completed: !completed }
                    : currentTodo;
                });
              })}
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
