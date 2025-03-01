import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { ClearButton } from '../ClearButton/ClearButton';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { Dispatch, FC } from 'react';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  activeFilter: Status;
  setActiveFilter: Dispatch<React.SetStateAction<Status>>;
  handleAutofocus: (isEnabled: boolean) => void;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
};

export const Footer: FC<Props> = ({
  setTodos,
  todos,
  setActiveFilter,
  activeFilter,
  handleAutofocus,
  setErrorMesage,
}) => {
  const statusOptions = Object.values(Status);
  const activeTodos: number = todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {statusOptions.map((title, indx) => {
          return (
            <FilterButtons
              activeFilter={activeFilter}
              key={indx}
              title={title}
              activeOptions={statusOptions[indx]}
              setActiveFilter={setActiveFilter}
            />
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <ClearButton
        todos={todos}
        setTodos={setTodos}
        handleAutofocus={handleAutofocus}
        setErrorMesage={setErrorMesage}
      />
    </footer>
  );
};
