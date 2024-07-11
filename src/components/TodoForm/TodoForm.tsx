import { ChangeEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';
import { addTodos, USER_ID } from '../../api/todos';
import { ErrorType } from '../../types/Errors';

type Props = {
  handleError: (message: string) => void;
};

export const TodoForm: React.FC<Props> = ({ handleError }) => {
  const { title, isSubmitting } = useGlobalState();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addTodo = ({
    userId,
    title: newTitle,
    completed,
  }: Omit<Todo, 'id'>) => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
    dispatch({ type: Type.setIsSubmitting, payload: true });

    return addTodos({ userId, title: newTitle, completed })
      .then(newTodo => {
        dispatch({ type: Type.AddTodo, payload: newTodo });
        dispatch({ type: Type.setTitle, payload: '' });
      })
      .catch(() => {
        handleError(ErrorType.ADD_TODO);
      })
      .finally(() => {
        dispatch({ type: Type.setIsSubmitting, payload: false });
        dispatch({ type: Type.setTempTodo, payload: null });
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError(ErrorType.EMPTY_TITLE);
      dispatch({ type: Type.setTitle, payload: '' });

      return;
    }

    const newTodo: Todo = {
      id: +new Date(),
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo);

    dispatch({
      type: Type.setTempTodo,
      payload: {
        id: 0,
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      },
    });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    dispatch({ type: Type.setTitle, payload: event.target.value });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleQueryChange}
        ref={inputRef}
        disabled={isSubmitting}
      />
    </form>
  );
};
