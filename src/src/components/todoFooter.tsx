import { useContext } from "react";
import cn from "classnames";
import { TodosContext } from "../services/Store";
import { Status } from "../types/Status";
import * as todoService from "../api/todos";

export const TodoFooter: React.FC = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setIsHidden,
    setLoadErrorMessage,
    setIsSubmiting,
    setClearButtonClicked,
  } = useContext(TodosContext);

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const handleClearComletedButton = () => {
    const notCompleted = todos.filter((todo) => !todo.completed);

    setClearButtonClicked(true);

    [...todos].map((todo) => {
      if (todo.completed) {
        setIsSubmiting(true);
        todoService
          .deleteTodo(todo.id)
          .then(() => {
            setTodos(notCompleted);
          })
          .catch((error) => {
            setIsHidden(false);
            setLoadErrorMessage("Unable to delete a todo");
            throw error;
          })
          .finally(() => {
            setTimeout(() => {
              setIsHidden(true);
              setLoadErrorMessage("");
            }, 3000);
            setIsSubmiting(false);
            setClearButtonClicked(false);
          });
      }
    });
  };

  const completedTodos = todos.some((todo) => todo.completed);

  //select few els

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos === 1
          ? `${activeTodos} item left`
          : `${activeTodos} items left`}
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
      >
        {completedTodos && "Clear completed"}
      </button>
    </footer>
  );
};
