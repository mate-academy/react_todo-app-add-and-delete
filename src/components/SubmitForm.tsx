import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage, Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';
interface Props {
  inputPlaceHolder: string;
  inputClassName: string;
  setErrorMessage?: (msg: ErrorMessage) => void;

  todos?: Todo[];
  onAddTodo?: (todo: Todo) => void;
  setTempTodo?: (tempTodo: Todo | null) => void;

  updateTodo?: Todo;
  setIsUpdate?: (val: boolean) => void;
  onUpdateTodo?: (todo: Todo) => void;
  onDelete?: (id: number) => void;
}

export const SubmitForm: React.FC<Props> = ({
  inputPlaceHolder,
  todos,
  onAddTodo,
  setErrorMessage,
  updateTodo,
  setIsUpdate,
  onUpdateTodo,
  inputClassName,
  onDelete,
  setTempTodo,
}) => {
  const [inputQuery, setInputQuery] = useState(updateTodo?.title || '');
  const [isDisableInput, setIsDisableInput] = useState(false);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    focusInput.current?.focus();
  }, [isDisableInput, todos]);

  const isAdd = todos && onAddTodo && setErrorMessage && setTempTodo;
  const isUpdate = updateTodo && setIsUpdate && onUpdateTodo && onDelete;

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isUpdate) {
      if (inputQuery.trim()) {
        const updatedTodo = {
          id: updateTodo.id,
          userId: USER_ID,
          title: inputQuery,
          completed: updateTodo.completed,
        };

        setInputQuery('');
        onUpdateTodo(updatedTodo);
      } else {
        onDelete(updateTodo.id);
      }

      setIsUpdate(false);
    }

    if (isAdd) {
      setErrorMessage(ErrorMessage.DEFAULT);

      if (!inputQuery.trim()) {
        setErrorMessage(ErrorMessage.TITLE_EMPTY);

        return;
      }

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: inputQuery.trim(),
        completed: false,
        loading: true,
      };

      setIsDisableInput(true);
      setTempTodo(newTodo);
      addTodo(newTodo)
        .then(newTodoFS => {
          onAddTodo(newTodoFS);
          setInputQuery('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.TODO_ADD);
        })
        .finally(() => {
          setTempTodo(null);
          setIsDisableInput(false);
        });
    }
  };

  const handleOnBlur = () => {
    if (isUpdate) {
      if (inputQuery.trim()) {
        const updatedTodo = {
          id: updateTodo.id,
          userId: USER_ID,
          title: inputQuery,
          completed: updateTodo.completed,
        };

        onUpdateTodo(updatedTodo);
      } else {
        onDelete(updateTodo.id);
      }

      setIsUpdate(false);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        onBlur={handleOnBlur}
        data-cy="NewTodoField"
        type="text"
        value={inputQuery}
        onChange={event => setInputQuery(event.target.value)}
        className={inputClassName}
        placeholder={inputPlaceHolder}
        disabled={isDisableInput}
        ref={focusInput}
      />
    </form>
  );
};
