import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ToggleAllButton } from '../ToggleAllButton';
import { addTodo, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setLoadingTodoIds,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  function handleChangeQuery(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsInputDisabled(true);

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
      setIsInputDisabled(false);

      return;
    }

    const newTodoId = (todos.at(-1)?.id ?? 0) + 1;

    const newTodo: Todo = {
      id: newTodoId,
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    setLoadingTodoIds(currentIds => [...currentIds, newTodoId]);
    setTodos(currentTodos => [...currentTodos, newTodo]);

    addTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === newTodoId ? createdTodo : todo,
          ),
        );
        setQuery('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== newTodoId),
        );
      })
      .finally(() => {
        setIsInputDisabled(false);
        setLoadingTodoIds([]);
      });
  }

  return (
    <header className="todoapp__header">
      <ToggleAllButton todos={todos} setTodos={setTodos} />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={handleChangeQuery}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
