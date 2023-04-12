import React, { FC, useContext, useState } from 'react';
import { sendNewTodo } from '../../api/todos';
import { AppTodoContext } from '../AppTodoContext/AppTodoContext';
import { ErrorType } from '../Error/Error.types';
import { USER_ID } from '../../react-app-env';

export const NewTodoForm: FC = () => {
  const {
    setTempTodo,
    setErrorMessage,
    setTodos,
  } = useContext(AppTodoContext);

  const [inputValue, setInputValue] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const handleInputChange = (value: string) => {
    setErrorMessage(ErrorType.NoError);
    setInputValue(value);
  };

  const handleAddingTodoOnAPI = async (title: string) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    setIsInputDisabled(true);
    const newTodo = await sendNewTodo(inputValue, USER_ID);

    try {
      setTodos(
        prevTodos => [...prevTodos, newTodo],
      );
    } catch {
      setErrorMessage(ErrorType.NewTodoError);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInputValue('');

    const validatedValue = inputValue.trim();

    if (validatedValue === '') {
      setErrorMessage(ErrorType.InputError);

      return;
    }

    setErrorMessage(ErrorType.NoError);
    handleAddingTodoOnAPI(validatedValue);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={(event) => handleInputChange(event.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  );
};
