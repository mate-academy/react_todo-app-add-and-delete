import { ActiveLink } from '../types/ActiveLink';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { ClearCompletedButton } from './ClearCompletedButton';
import { NavLinks } from './NavLinks';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  activeLink: ActiveLink;
  setActiveLink: (l: ActiveLink) => void;
  setLoadingIds: (ids: number[]) => void;
  focusInput: () => void;
};

export const Footer = ({
  todos,
  setTodos,
  activeLink,
  setActiveLink,
  setErrorMessage,
  setLoadingIds,
  focusInput,
}: Props) => {
  const counter = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counter} items left`}
      </span>

      <NavLinks activeLink={activeLink} setActiveLink={setActiveLink} />

      <ClearCompletedButton
        todos={todos}
        setTodos={setTodos}
        setErrorMessage={setErrorMessage}
        setLoadingIds={setLoadingIds}
        focusInput={focusInput}
      />
    </footer>
  );
};
