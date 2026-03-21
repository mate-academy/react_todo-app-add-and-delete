import { useState } from 'react';
import { TempTodo, Todo } from '../types/Todo';
import { postCreateTodo } from '../api/todos';

export const useTodo = (initialTodos: Todo[]) => {
  const [todo, setTodo] = useState<Todo[]>(initialTodos);
  const [tempTodo, setTempTodo] = useState<TempTodo[] | null>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [disableInput, setDisableInput] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const handleErro = (message: string) => {
    setErrorMessage(message);
    setIsError(true);
  };

  const reset = () => {
    setTitle('');
  };

  const addTodo = ({ title: todoTitle, completed: isDone, userId }: Todo) => {
    setDisableInput(true);

    postCreateTodo({ title: todoTitle, completed: isDone, userId })
      .then(newTodo => {
        setTodo(currentTodos => [...currentTodos, newTodo]);
        reset();
      })
      .catch(() => {
        // toda requisiçao ao servidor deve vir acompanha de catch para tratamento de erros, e tbm response.ok
        handleErro('Unable to add a todo');
      })
      .finally(() => {
        setDisableInput(false);
        setTempTodo(null);
      });
    // como estou passando valor para os Sets, deve criar uma funçao anonima, abrir colchetes e atualizar os estados
  };

  const inpuProps = {
    todo: todo,
    tempTodo: tempTodo,
    setTempTodo: setTempTodo,
    errorMessage: errorMessage,
    isError: isError,
    disableInput: disableInput,
    title: title,
    setTodo: setTodo,
    addTodo: addTodo,
    setTitle: setTitle,
    setErrorMessage: setErrorMessage,
    setIsError: setIsError,
  };

  return inpuProps;
};
