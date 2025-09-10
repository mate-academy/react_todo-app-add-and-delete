import React, { useEffect, useRef, useState } from 'react';
import { ErrorType, LoadedTodo, Todo } from '../../types/Types';
import { postTodo } from '../../api/todos';

type Props = {
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setLoadedTodo: React.Dispatch<React.SetStateAction<LoadedTodo>>;
  loadedTodo: LoadedTodo;
  deletedTodo: number | null;
  CompletedCount: boolean;
};

export const FormAddTodo: React.FC<Props> = ({
  setError,
  setTodos,
  setTempTodo,
  setLoadedTodo,
  loadedTodo,
  deletedTodo,
  CompletedCount,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isTodoNotLoaded = !loadedTodo.isLoad;

  useEffect(() => {
    if (isTodoNotLoaded) {
      inputRef.current?.focus();
    }
  }, [isTodoNotLoaded, deletedTodo, CompletedCount]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleTrimmed = todoTitle.trim();

    if (!titleTrimmed) {
      setError(ErrorType.TitleEmpty);
      inputRef.current?.focus();
      timerRef.current = setTimeout(() => setError(ErrorType.None), 3000);

      return;
    }

    const temp = { id: 0, userId: 3461, title: titleTrimmed, completed: false };

    setTempTodo(temp);
    setLoadedTodo(prev => ({ ...prev, isLoad: true }));

    postTodo({ title: titleTrimmed })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTodoTitle('');
        setLoadedTodo(prev => ({ ...prev, id: newTodo.id }));
      })
      .catch(() => {
        setError(ErrorType.CantAdd);
        const timer = setTimeout(() => setError(ErrorType.None), 3000);

        return () => clearTimeout(timer);
      })

      .finally(() => {
        setTempTodo(null);
        setLoadedTodo(prev => ({ ...prev, isLoad: false }));
        inputRef.current?.focus();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={e => setTodoTitle(e.target.value)}
        disabled={loadedTodo.isLoad}
      />
    </form>
  );
};
