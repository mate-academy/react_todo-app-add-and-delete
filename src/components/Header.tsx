import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodos } from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: (v: string) => void,
  setHiddenError: (v: boolean) => void,
  loading: boolean,
  setLoading: (v: boolean) => void,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setHiddenError,
  loading,
  setLoading,
  setTempTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const handleCatchEmpty = () => {
    setHiddenError(false);
    setTimeout(() => setHiddenError(true), 3000);
    setErrorMessage("Title can't be empty");
  };

  const handleCatchApi = () => {
    setHiddenError(false);
    setTimeout(() => setHiddenError(true), 3000);
    setErrorMessage('Unable to add a todo');
  };

  const handleFinally = () => {
    setLoading(false);
    setTempTodo(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = {
      title: inputValue.trim(),
      userId: todos[0].userId,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      userId: todos[0].userId,
      title: data.title,
      completed: false,
    };

    setTempTodo(tempTodo);

    const handlerAddTodos = () => {
      setLoading(true);
      addTodos(data).then((res: Todo) => {
        const newTodoRes = { ...tempTodo, id: res.id };

        setTodos(prev => [...prev, newTodoRes]);
      })
        .catch(() => handleCatchApi())
        .finally(() => handleFinally());
    };

    e.preventDefault();
    if (data.title) {
      handlerAddTodos();
    } else {
      handleCatchEmpty();
    }

    setInputValue('');
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
          disabled={loading}
        />
      </form>
    </header>
  );
};
