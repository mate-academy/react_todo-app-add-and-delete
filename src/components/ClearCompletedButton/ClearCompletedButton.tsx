import React, { useContext, useRef } from 'react';
import { Todo } from '../../types';
import { TodosDispatchContext } from '../../contexts/TodosContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { FormInputContext } from '../../contexts/FormInputContext';
import { todosApi } from '../../api/todos';

type Props = {
  completedTodos: Todo[];
};

export const ClearCompletedButton: React.FC<Props> = ({ completedTodos }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const todosDispatch = useContext(TodosDispatchContext);
  const { setError } = useContext(ErrorContext);
  const { focus: focusFormInput, setDisabled: setDisabledFormInput } =
    useContext(FormInputContext);

  const setDisabled = (value: boolean) => {
    if (buttonRef.current) {
      buttonRef.current.disabled = value;
    }

    setDisabledFormInput(value);
  };

  const deleteCompletedTodos = async () => {
    setError({ message: '' });
    setDisabled(true);

    const deletePromises = completedTodos.map(todo => {
      todosDispatch({
        type: 'setLoad',
        payload: { id: todo.id, loading: true },
      });

      return todosApi.delete(todo.id);
    });

    const deletePromisesResult = await Promise.allSettled(deletePromises);

    deletePromisesResult.forEach((result, index) => {
      const currentTodo = completedTodos[index];

      if (result.status === 'fulfilled' && currentTodo) {
        todosDispatch({ type: 'delete', payload: currentTodo.id });
      } else {
        setError({ message: 'Unable to delete a todo' });
      }

      todosDispatch({
        type: 'setLoad',
        payload: { id: currentTodo.id, loading: false },
      });
    });

    setDisabled(false);
    focusFormInput();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!completedTodos.length}
      onClick={deleteCompletedTodos}
    >
      Clear completed
    </button>
  );
};
