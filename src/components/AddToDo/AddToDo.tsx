import { Todo } from '../../types/Todo';
import { addTodos, USER_ID } from '../../api/todos';
import { FakeToDo } from '../../types/fakeTodo';
import { useState } from 'react';

type Props = {
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  disabled: boolean;
  handleAutofocus: (isEnabled: boolean) => void;
  setFakeTodo: React.Dispatch<React.SetStateAction<FakeToDo | null>>;
  setLoader: React.Dispatch<React.SetStateAction<number | null>>;
};

export const AddTodos: React.FC<Props> = ({
  setErrorMesage,
  setTodos,
  inputRef,
  disabled,
  handleAutofocus,
  setFakeTodo,
  setLoader,
}) => {
  const [value, setValue] = useState<string>('');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      setErrorMesage('Title should not be empty');
      setTimeout(() => setErrorMesage(''), 3000);

      return;
    }

    handleAutofocus(true);
    const tempId = Math.floor(Math.random() * 100000000);
    const tempTodo = { id: tempId, title: value.trim() };

    setFakeTodo(tempTodo);
    setLoader(tempId);

    const data = {
      title: value.trim(),
      userId: USER_ID,
      completed: false,
    };

    addTodos(data)
      .then(response => {
        setFakeTodo(null);
        setLoader(null);
        setTodos(prev => [...prev, response]);
        setValue('');
      })
      .catch(() => {
        setErrorMesage('Unable to add a todo');
      })
      .finally(() => {
        handleAutofocus(false);
        setFakeTodo(null);
        setTimeout(() => {
          setErrorMesage('');
          setValue('');
        }, 300);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={handleOnChange}
        value={value}
        disabled={disabled}
        ref={inputRef}
      />
    </form>
  );
};
