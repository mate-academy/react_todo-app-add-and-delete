import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { createTodo, USER_ID } from '../../api/todos';
import { ErrorContext } from '../../context/Error.context';
import { TodoContext } from '../../context/Todo.context';

interface CustomElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
}

interface CreateTodoForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

export const useCreateTodoForm = () => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { inputRef, onAddTodo, onSaveTempTodo, clearTempTodo } =
    useContext(TodoContext);
  const { onError, clearError } = useContext(ErrorContext);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, inputRef]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
  };

  const onSubmit = async (event: React.FormEvent<CreateTodoForm>) => {
    setIsLoading(true);
    event.preventDefault();
    clearError();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setIsLoading(false);

      return onError('Title should not be empty');
    }

    const createTodoDTO = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    onSaveTempTodo({ id: 0, ...createTodoDTO });

    try {
      const response = await createTodo(createTodoDTO);

      onAddTodo(response);

      setTitle('');
    } catch (err) {
      onError('Unable to add a todo');
    } finally {
      setIsLoading(false);
      clearTempTodo();
    }
  };

  return {
    title,
    isLoading,
    inputRef,
    onChange,
    onSubmit,
  };
};
