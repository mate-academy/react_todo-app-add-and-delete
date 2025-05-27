import { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { createTodo, USER_ID } from '../api/todos';
import * as Constants from './constants';

interface FormProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showErrorContainer: (message: string) => void;
}

export const useTodoForm = ({ setTodos, showErrorContainer }: FormProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAddingTodo && inputRef.current) {
      inputRef.current.focus(); // Фокус після завершення додавання
    }
  }, [isAddingTodo]); // Викликається при зміні `isAddingTodo`

  // const handleNewTodoSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const title = newTodoTitle.trim();

  //   if (!title) {
  //     showErrorContainer(Constants.EMPTY_TITLE_ERROR);

  //     return;
  //   }

  //   setIsAddingTodo(true);
  //   setTempTodo({ id: Date.now(), title, completed: false, userId: USER_ID });

  //   try {
  //     const tempNewTodo: Omit<Todo, 'id'> = {
  //       userId: USER_ID,
  //       title,
  //       completed: false,
  //     };

  //     const createdTodo = await createTodo(tempNewTodo);

  //     setTodos(prevTodos => [...prevTodos, createdTodo]);
  //     setNewTodoTitle('');

  //     // Затримка для забезпечення рендерингу та стабілізації DOM
  //     await new Promise(resolve => setTimeout(resolve, 0)); // Додано очікування

  //     if (inputRef.current) {
  //       console.log('Встановлюємо фокус на input у useTodoFor');
  //       inputRef.current.focus();
  //     }
  //   } catch (err) {
  //     showErrorContainer(Constants.ADD_TODO_ERROR);
  //   } finally {
  //     setIsAddingTodo(false);
  //     setTempTodo(null);
  //   }
  // };

  const handleNewTodoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showErrorContainer(Constants.EMPTY_TITLE_ERROR);

      return;
    }

    setIsAddingTodo(true);
    setTempTodo({ id: Date.now(), title, completed: false, userId: USER_ID });

    try {
      const tempNewTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title,
        completed: false,
      };

      const createdTodo = await createTodo(tempNewTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);

      // Спочатку фокусуємо поле вводу, потім очищаємо заголовок
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setNewTodoTitle('');

      // Додаємо затримку перед фокусуванням, щоб уникнути проблем із рендерингом
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (err) {
      showErrorContainer(Constants.ADD_TODO_ERROR);
    } finally {
      setIsAddingTodo(false);
      setTempTodo(null);
    }
  };

  const handleNewTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  return {
    newTodoTitle,
    isAddingTodo,
    tempTodo,
    inputRef,
    handleNewTodoSubmit,
    handleNewTodoTitleChange,
  };
};
