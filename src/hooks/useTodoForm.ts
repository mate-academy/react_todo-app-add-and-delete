import { useState } from 'react';

export const useTodoForm = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isFocusedInput, setIsFocusedInput] = useState(true);

  return {
    newTodoTitle,
    setNewTodoTitle,
    isLoadingSubmit,
    setIsLoadingSubmit,
    isFocusedInput,
    setIsFocusedInput,
  };
};
