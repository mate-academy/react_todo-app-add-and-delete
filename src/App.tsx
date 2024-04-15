import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deletePost, getTodos, addPost } from './api/todos';
import { TodosContext } from './components/todosContext';
import { TodosList } from './components/todosList';
import { TodosFilter } from './components/todoFeilter';
import { ManageCheckboxContext } from './components/manageCheckboxContext';
import { ErrorNotification } from './components/errorNotification';
import { ErrorConstext } from './components/errorMessageContext';
import { Todo } from './types/Todo';
import { SubmitingConstext } from './components/isSubmitingContext';

import classNames from 'classnames';
import { TodoIdConstext } from './components/todoIdContext';

export const App: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const { isChecked, setIsChecked } = useContext(ManageCheckboxContext);
  const { setErrorMessage } = useContext(ErrorConstext);
  const { isSubmiting, setIsSubmiting } = useContext(SubmitingConstext);
  const { allId } = useContext(TodoIdConstext);

  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInput.current && !isSubmiting) {
      focusInput.current.focus();
    }
  }, [isSubmiting]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [todos]);

  const handleHowManyLeft = () => {
    const howManyLeft = todos.filter(todo => !todo.completed);

    return `${howManyLeft.length} items left`;
  };

  const changeAllComplete = () => {
    return todos.map(elem => {
      return {
        ...elem,
        completed: !isChecked,
      };
    });
  };

  const handleButtonCheckAll = () => {
    if (todos.length === 0) {
      return;
    }

    setIsChecked(!isChecked);
    setTodos(changeAllComplete());
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const toggleAllClass = classNames({
    'todoapp__toggle-all': true,
    active: isChecked,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const newTodo = {
    id: +new Date(),
    title: inputValue.trim(),
    completed: false,
    userId: USER_ID,
  };

  const onSubmit = () => {
    if (inputValue.trim() !== '') {
      setIsSubmiting(true);
      setTempTodo({
        id: 0,
        title: inputValue.trim(),
        completed: false,
        userId: USER_ID,
      });
      addPost(newTodo)
        .then(newTodoObj => {
          setInputValue('');
          setTodos([...todos, newTodoObj]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setIsSubmiting(false);
          setTempTodo(null);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    }
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();
      onSubmit();
    } else if (event.key === 'Enter' && inputValue.trim() === '') {
      event.preventDefault();
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      return;
    }
  };

  const handleClearCompleted = () => {
    const todosCopy = [...todos];

    setIsSubmiting(true);

    for (let i = todosCopy.length - 1; i >= 0; i--) {
      if (todosCopy[i].completed === true) {
        allId.push(todosCopy[i].id);

        deletePost(todosCopy[i].id)
          .then(() => setTodos(todosCopy))
          .catch(() => setErrorMessage('Unable to delete a todo'))
          .finally(() => {
            setIsSubmiting(false);

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          });
        todosCopy.splice(i, 1);
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={toggleAllClass}
            data-cy="ToggleAllButton"
            onClick={handleButtonCheckAll}
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              disabled={isSubmiting}
              ref={focusInput}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {tempTodo ? (
            <TodosList items={[...todos, tempTodo]} />
          ) : (
            <TodosList items={todos} />
          )}
        </section>

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {handleHowManyLeft()}
            </span>
            <nav className="filter" data-cy="Filter">
              <TodosFilter />
            </nav>

            <button
              disabled={todos.every(element => !element.completed)}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
