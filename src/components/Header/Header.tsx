import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import callError from '../../utils/callError';
import { addTodo, USER_ID } from '../../api/todos';
import { MainContext } from '../../ContextProvider/ContextProvider';

const Header: React.FC = ({}) => {
  const { todos, setTodos, setError, loadingIds, setLoadingIds, setTempTodo } =
    useContext(MainContext);

  const [todoInputValue, setTodoInputValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isAllActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current as HTMLElement;

      input.focus();
    }
  }, [todos]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const todoTitle = todoInputValue.trim();

    if (!todoTitle.length) {
      callError(setError, 'emptyTitle');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    setIsDisabled(true);
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    });
    setLoadingIds([...loadingIds, 0]);

    addTodo(todoTitle)
      .then(todo => {
        setTodoInputValue('');
        setLoadingIds([todo.id]);
        setTempTodo(null);
        setTodos([...todos, todo]);
      })
      .catch(() => {
        setTempTodo(null);
        callError(setError, 'add');

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .finally(() => {
        setLoadingIds([0]);
        setIsDisabled(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: isAllActive })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          ref={inputRef}
          value={todoInputValue}
          onChange={event => setTodoInputValue(event?.target.value)}
        />
      </form>
    </header>
  );
};

export default Header;
