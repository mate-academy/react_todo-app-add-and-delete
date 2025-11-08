import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react';
import * as todosService from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  userId: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError: (message: ErrorMessage) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header = forwardRef<{ focusInput: () => void }, Props>(
  ({ userId, setTodos, showError, setTempTodo }, ref) => {
    const [title, setTitle] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
      inputRef.current?.focus();
    };

    useImperativeHandle(ref, () => ({ focusInput }));

    useEffect(() => {
      if (!isDisabled) {
        focusInput();
      }
    }, [isDisabled]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const trimmed = title.trim();

      if (!trimmed) {
        showError(ErrorMessage.TitleError);

        return;
      }

      const tempTodo: Todo = {
        id: 0,
        userId,
        title: trimmed,
        completed: false,
      };

      setTempTodo(tempTodo);
      setIsDisabled(true);

      try {
        const newTodo = await todosService.addTodo({
          userId,
          title: trimmed,
          completed: false,
        });

        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      } catch {
        showError(ErrorMessage.AddError);
      } finally {
        setTempTodo(null);
        setIsDisabled(false);
      }
    };

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={handleTitleChange}
            disabled={isDisabled}
            autoFocus
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
