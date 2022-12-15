/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { NewTodoField } from './NewTodoField';

type Props = {
  user: User | null,
  title: string,
  changeTitle: (value: string) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  onSetTodo: (newTodo: Todo) => void,
  onSetTitleError: (isError: boolean) => void,
  onSetIsAdding: (isLoading: boolean) => void,
  isAdding: boolean,
};

export const Header: React.FC<Props> = (
  {
    user,
    title,
    changeTitle,
    newTodoField,
    onSetTodo,
    onSetTitleError,
    onSetIsAdding,
    isAdding,
  },
) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <NewTodoField
        user={user}
        onSetTodo={onSetTodo}
        newTodoField={newTodoField}
        title={title}
        changeTitle={changeTitle}
        onSetTitleError={onSetTitleError}
        onSetIsAdding={onSetIsAdding}
        isAdding={isAdding}
      />
    </header>
  );
};
