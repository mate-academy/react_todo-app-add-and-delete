import React, {
  FormEvent, useEffect, useMemo, useRef, useState,
} from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TContext, useTodoContext } from './TodoContext';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const {
    todos,
    setTodos,
    // hasError,
    setHasError,
    // tempTodos,
    setTempTodos,
  } = useTodoContext() as TContext;

  const counter = useMemo(() => {
    return Math.max(...todos.map(todo => todo.id)) + 1;
  }, [todos]);

  useEffect(() => {
    if (!isSubmitting) {
      titleInputRef.current?.focus(); // ustaw fokus na input po dodaniu
    }
  }, [!isSubmitting]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Todo = {
      userId: 11550,
      id: counter,
      title: title.trim(),
      completed: false,
    };

    if (title.trim().length === 0) {
      setHasError('Title should not be empty');
      setTimeout(() => setHasError(null), 3000);
    } else {
      setTempTodos({ ...newTodo, id: 0 });
      setIsSubmitting(true);

      addTodo(newTodo)
        .then((res) => {
          setTodos([...todos, res]);
          setTitle('');
        })
        .catch((error) => {
          setHasError('Unable to add a todo');
          // eslint-disable-next-line no-console
          console.log(error);
          setTimeout(() => setHasError(null), 3000);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodos(null);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        key="key-input-1"
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isSubmitting}
        ref={titleInputRef} // Przypisanie Ref do pola tekstowego
      />
    </form>
  );
};
