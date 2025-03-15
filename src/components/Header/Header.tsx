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
  const context = useContext(MainContext);
  const { todos, setTodos, setError, loadingIds, setLoadingIds, setTempTodo } =
    context;

  const [todoInputValue, setTodoInputValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const focusedInput = useRef(null);

  const isAllActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (focusedInput.current) {
      const input = focusedInput.current as HTMLElement;

      input.focus();
    }
  }, [isDisabled, todos]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const todoTitle = todoInputValue.trim();

    if (!todoTitle.length) {
      callError(setError, 'emptyTitle');

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
      })
      .finally(() => {
        setLoadingIds([0]);
        setIsDisabled(false);
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
          ref={focusedInput}
          value={todoInputValue}
          onChange={event => setTodoInputValue(event?.target.value)}
        />
      </form>
    </header>
  );
};

export default Header;
