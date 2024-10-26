import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { ToggleAllButton } from '../../components/ToggleAllButton';
import { Form } from '../../components/Form';

type Props = {
  filteredTodos: Todo[];
  isAllCompleted: boolean;
  setTitle: (title: string) => void;
  setCurrentError: (error: Errors | null) => void;
  isNewTodoAdding: boolean;
  isAdded: boolean | null;
  currentError: Errors | null;
  isTodoDeleting: boolean;
};

export const Header: React.FC<Props> = ({
  filteredTodos,
  isAllCompleted,
  setTitle,
  setCurrentError,
  isNewTodoAdding,
  isAdded,
  isTodoDeleting,
  currentError,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {filteredTodos.length > 0 && (
        <ToggleAllButton isAllCompleted={isAllCompleted} />
      )}

      {/* Add a todo on form submit */}
      <Form
        setTitle={setTitle}
        setCurrentError={setCurrentError}
        isNewTodoAdding={isNewTodoAdding}
        isAdded={isAdded}
        isTodoDeleting={isTodoDeleting}
        currentError={currentError}
      />
    </header>
  );
};
