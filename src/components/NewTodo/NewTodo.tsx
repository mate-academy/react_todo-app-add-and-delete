import React, {
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as todoService from '../../api/todos';
import { TodoContext } from '../../TodoContext/TodoContext';
import { ErrorMessages, Todo } from '../../types/Todo';

interface Props {
  onTodoCreated: (todo: Todo) => void;
}

export type TodoCreateData = {
  title: string;
};

export const NewTodo: React.FC<Props> = ({ onTodoCreated }) => {
  const { setError, displayError, isLoading, setIsLoading, setTempTodo } =
    useContext(TodoContext);
  const [title, setTitle] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      displayError(ErrorMessages.TitleIsEmpty);

      return;
    }

    setIsLoading(true);
    todoService
      .createTodo({
        userId: todoService.USER_ID,
        title: { title: title.trim() }.title,
        completed: false,
      })
      .then(newTodo => {
        onTodoCreated(newTodo);
        setTitle('');
      })
      .catch(() => {
        displayError(ErrorMessages.AddTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: { title: title.trim() }.title,
      completed: false,
    });
  };

  useEffect(() => {
    setError(null);
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [setError]);

  useEffect(() => {
    if (!isLoading) {
      titleField?.current?.focus();
    }
  }, [isLoading]);

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
      <input
        disabled={isLoading}
        ref={titleField}
        data-cy="NewTodoField"
        type="text"
        value={title}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleChange}
      />
    </form>
  );
};
