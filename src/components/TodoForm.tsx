import React, {
  FormEvent, useEffect, useRef, useState,
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

  useEffect(() => {
    if (!isSubmitting) {
      titleInputRef.current?.focus(); // ustaw fokus na input po dodaniu
    }
  }, [!isSubmitting]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setHasError('Title should not be empty');
      setTimeout(() => setHasError(null), 3000);
    }

    const newTodo: Todo = {
      userId: 11550,
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title,
      completed: false,
    };

    setTempTodos({ ...newTodo, id: 0 });
    setIsSubmitting(true);

    if (!(title.trim().length === 0)) {
      addTodo(newTodo)
        .then(res => {
          // setIdTemp(newTodo.id);
          setTodos([...todos, res]);
          setTitle('');
        })
        .catch(() => {
          setHasError('Unable to add a todo');
          setTimeout(() => setHasError(null), 3000);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodos(null);
          setTodos([...todos, newTodo]);
          // setIdTemp(null);
        // titleInputRef.current?.focus(); // Ustaw fokus
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
