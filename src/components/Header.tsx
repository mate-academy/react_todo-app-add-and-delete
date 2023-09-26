import {
  useContext, useEffect, useRef,
} from 'react';
import { TodosContext } from '../context/TodoContext';

export const Header = () => {
  const {
    todos,
    setNewTodoTitle,
    newTodoTitle,
    handleError,
    addTodo,
    USER_ID,
    disabledInput,
    setDisabledInput,
    // setTempTodo,
    // tempTodo,
    // setError,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabledInput(true);

    if (newTodoTitle.trim() === '') {
      handleError('Title should not be empty');
      setDisabledInput(false);

      return;
    }

    const todo = {
      title: newTodoTitle.trim(),
      completed: false,
      userId: USER_ID,
      // id: Math.ceil(Math.random() * 10000),
      // id: 0,
    };

    addTodo(todo);

    // setTempTodo(todo);
    // console.log(todo);

    // Promise.resolve(addTodo(todo))
    //   .then(() => {
    //     setNewTodoTitle('');
    //   })
    //   .catch(() => {
    //     setError('Unable to add a todo');
    //   })
    //   .finally(() => {
    //     setDisabledInput(false);
    //     setTempTodo(null);
    //   });
    // setNewTodoTitle('');
    // setDisabledInput(false);
    // setTempTodo(null);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0
        && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            title="showTodos"
            aria-label="ToggleAllButton"
          />
        )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setNewTodoTitle(event.target.value)}
          value={newTodoTitle}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
