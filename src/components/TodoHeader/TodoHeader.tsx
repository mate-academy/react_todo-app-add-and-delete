import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoError } from '../../types/enums/TodoError';
import { client } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../utils/context';

type Props = {
  setTempTodo: (a: Todo | null) => void;
};

export const TodoHeader: React.FC<Props> = ({
  setTempTodo,
}) => {
  const [todoInput, setTodoInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const {
    setIsErrorVisible,
    setTodos,
    setErrorMessage,
    todos,
    isErrorVisible,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoInput, isWaiting, todos, isErrorVisible]);

  const handlerInputTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(event.target.value);
  };

  const handlerAddNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTodoTitle = todoInput.trim();

    if (!preparedTodoTitle) {
      setIsErrorVisible(true);
      setErrorMessage(TodoError.TitleShouldNotBeEmpty);

      return;
    }

    const newTodo = {
      id: 0,
      userId: 41,
      title: preparedTodoTitle,
      completed: false,
    };

    setIsWaiting(true);
    setTempTodo(newTodo);

    client
      .post('/todos', newTodo)
      .then((createdTodo) => {
        setTodos((pre: Todo[]) => [...pre, createdTodo as Todo]);
        setTodoInput('');
        setIsWaiting(false);
      })
      .catch(() => {
        setIsErrorVisible(true);
        setErrorMessage(TodoError.UnableToAdd);
        setIsWaiting(false);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handlerAddNewTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handlerInputTodo}
          value={todoInput}
          disabled={isWaiting}
        />
      </form>
    </header>
  );
};
