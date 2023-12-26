import classNames from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as TodoService from '../api/todos';
import { TodosContext } from '../context/TodosContext';
import { Todo } from '../types/Todo';
import { USER_ID } from '../constants/USER_ID';
import { Errors } from '../types/Errors';

export const TodoHeader = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    isLoading,
    setIsLoading,
  } = useContext(TodosContext);

  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const activeSomeTask = todos.some(todo => todo.completed !== false);

  const addTodo = ({ userId, title: todoTitle, completed }: Todo) => {
    setIsLoading(true);
    setErrorMessage(Errors.NoErrors);

    setTempTodo({
      id: 0,
      userId: +USER_ID,
      title,
      completed: false,
    });

    return TodoService.createPosts({ userId, title: todoTitle, completed })
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage(Errors.AddTodoError);
        setTitle(title);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim()) {
      addTodo({
        id: +new Date(),
        userId: +USER_ID,
        title,
        completed: false,
      });
    } else {
      setErrorMessage(Errors.TitleEmplyError);
    }
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">

      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: activeSomeTask,
            },
          )}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
