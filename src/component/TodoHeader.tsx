import { useContext, useEffect, useRef, useState } from 'react';
import { USER_ID, createTodo } from '../api/todos';
import { TodosContext } from '../TodosProvider/TodosProvider';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const focus = useRef<HTMLInputElement>(null);
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    isCompleted,
    setIdDisabled,
    setIsLoadingToTemporary,
    fucused,
    setFocused,
    isDisabled,
  } = useContext(TodosContext);

  useEffect(() => {
    if (focus.current) {
      focus.current.focus();
    }
  }, [fucused]);

  let isError = false;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      userId: USER_ID,
      title: title.trim(),
      completed: isCompleted,
    };

    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: isCompleted,
    };

    setTempTodo(temporaryTodo);
    setIsLoadingToTemporary(true);
    setIdDisabled(true);

    createTodo(newTodo)
      .then(handleTodo => {
        return setTodos(prevTodo => [...prevTodo, handleTodo]);
      })
      .catch(error => {
        isError = true;

        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          throw error;
        }, 3000);
      })
      .finally(() => {
        setFocused(new Date());
        setIsLoadingToTemporary(false);
        setIdDisabled(false);
        setTempTodo(null);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        if (!isError) {
          setTitle('');
        }
      });
    isError = false;
  };

  return (
    <>
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={onSubmit}>
        <input
          ref={focus}
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
        />
      </form>
    </>
  );
};
