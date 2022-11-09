import React, { useCallback, useContext } from 'react';
import { addTodo } from '../api/todos';
import { ErrorsType } from '../types/ErrorsType';
import { normalizeTitle } from '../utils/normalizeTitle';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  isLoadingTodos: number[],
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType[]>>,
  setIsLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>,
  getTodosList: () => Promise<void>,
  errors: ErrorsType[],
  newTodoTitle: string,
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>
};

export const TodoAdd: React.FC<Props> = ({
  newTodoField,
  isLoadingTodos,
  setErrors,
  setIsLoadingTodos,
  getTodosList,
  errors,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  const user = useContext(AuthContext);

  const handlerFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsLoadingTodos(currentLoadTodos => [
        ...currentLoadTodos,
        0,
      ]);

      const normalizedTodoTitle = normalizeTitle(newTodoTitle);

      if (!normalizedTodoTitle) {
        setErrors(currErrors => [
          ...currErrors,
          ErrorsType.Title,
        ]);
        setTimeout(() => {
          setErrors(currErrors => currErrors
            .filter(error => error !== ErrorsType.Title));
        }, 3000);
        setNewTodoTitle('');
        setIsLoadingTodos(currentLoadTodos => currentLoadTodos
          .filter(x => x !== 0));

        return;
      }

      if (user && !errors.includes(ErrorsType.Title)) {
        try {
          await addTodo(user.id, normalizedTodoTitle);

          await getTodosList();
        } catch {
          setErrors(currErrors => [
            ...currErrors,
            ErrorsType.Add,
          ]);
          setTimeout(() => {
            setErrors(currErrors => currErrors
              .filter(error => error !== ErrorsType.Add));
          }, 3000);
        }
      }

      setNewTodoTitle('');
      setIsLoadingTodos(currentLoadTodos => currentLoadTodos
        .filter(x => x !== 0));
    }, [newTodoTitle],
  );

  const handlerInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
    setErrors(currErrors => currErrors
      .filter(error => error !== ErrorsType.Title));
  };

  return (
    <form onSubmit={handlerFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handlerInputTitle}
        disabled={isLoadingTodos.length > 0}
      />
    </form>
  );
};
