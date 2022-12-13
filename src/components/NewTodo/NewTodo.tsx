/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  useMemo, useContext, SetStateAction, Dispatch,
} from 'react';
import { addTodo, getTodos } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';

interface Props {
  newTodoField: React.LegacyRef<HTMLInputElement> | undefined,
  activeTodos: Todo[] | null,
  allTodos: Todo[] | null,
  setEmptyTitleError: Dispatch<SetStateAction<boolean>>,
  // eslint-disable-next-line max-len
  setErrorStatus: (setEmptyTitleError: Dispatch<SetStateAction<boolean>>) => void;
  setVisibleTodos: Dispatch<SetStateAction<Todo[] | null>>,
  setIsAdding: Dispatch<SetStateAction<boolean>>,
  isAdding: boolean,
  currentInput: string,
  setCurrentInput: Dispatch<SetStateAction<string>>,
  setPostErrorStatus: Dispatch<SetStateAction<boolean>>,
}

export const NewTodo: React.FC<Props> = (props) => {
  const {
    newTodoField,
    activeTodos,
    allTodos,
    setEmptyTitleError,
    setErrorStatus,
    setVisibleTodos,
    setIsAdding,
    isAdding,
    currentInput,
    setCurrentInput,
    setPostErrorStatus,
  } = props;

  const user = useContext(AuthContext);

  const newTodo = {
    title: currentInput,
    userId: user?.id,
    completed: false,
  };

  const areAllCompleted = useMemo(() => activeTodos?.length, [activeTodos]);

  return (
    <header className="todoapp__header">
      {(allTodos?.length !== 0) && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            { 'todoapp__toggle-all': true },
            { active: !areAllCompleted },
          )}
        />
      ) }
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsAdding(true);
          if (currentInput === '') {
            setErrorStatus(setEmptyTitleError);
          }

          if (user && currentInput.length > 0) {
            addTodo(user.id, newTodo)
              .then(() => getTodos(user.id))
              .then(userTodos => {
                setVisibleTodos(userTodos);
                setIsAdding(false);
                setCurrentInput('');
              })
              .catch(() => {
                setErrorStatus(setPostErrorStatus);
                setIsAdding(false);
              });
          }
        }}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={currentInput}
          onChange={(event) => {
            setCurrentInput(event.target.value);
          }}

        />
      </form>
    </header>
  );
};
