import { useContext } from "react";
import cn from "classnames";
import { TodosContext } from "../services/Store";
import { Status } from "../types/Status";
import * as todoService from "../api/todos";
import { ErrorText } from "../enums/errorText";

export const TodoFooter: React.FC = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setLoadErrorMessage,
    setIsSubmiting,
    setClearButtonClicked,
    setSelectedTodoId,
  } = useContext(TodosContext);

  const activeTodos = todos.filter((todo) => !todo.completed);

  const handleClearComletedButton = () => {
    setClearButtonClicked(true);
    setIsSubmiting(true);

    const completedTodoIds = [...todos]
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    [...todos].map((t) => {
      const newTodos = todos.filter(
        (todoItem) => !completedTodoIds.includes(todoItem.id),
      );

      if (t.completed) {
        todoService
          .deleteTodo(t.id)
          .then(() => {
            setTodos(newTodos);
          })
          .catch((error) => {
            setLoadErrorMessage(ErrorText.Deliting);
            throw error;
          })
          .finally(() => {
            setIsSubmiting(false);
            setSelectedTodoId(null);
          });
      }
    });
  };

  const completedTodos = todos.some((todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length === 1
          ? `${activeTodos.length} item left`
          : `${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn("filter__link", {
            selected: filter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn("filter__link", {
            selected: filter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn("filter__link", {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearComletedButton}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
