import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo } from './api/todos';
import { TodosContext } from './components/todosContext';
import { TodosList } from './components/todosList';
import { TodosFilter } from './components/todoFeilter';
import { ManageCheckboxContext } from './components/manageCheckboxContext';
import { ErrorNotification } from './components/errorNotification';
import { Todo } from './types/Todo';

import classNames from 'classnames';

export const App: React.FC = () => {
  const { todos, setTodos, handleDeleteTodo } = useContext(TodosContext);
  const { isChecked, setIsChecked } = useContext(ManageCheckboxContext);
  const { setErrorMessage } = useContext(TodosContext);
  const { isSubmiting, setIsSubmiting } = useContext(TodosContext);

  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInput.current && !isSubmiting) {
      focusInput.current.focus();
    }
  }, [isSubmiting, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [setErrorMessage, setTodos]);

  useEffect(() => {
    setErrorMessage('');
  }, [todos, setErrorMessage]);

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

  const onSubmit = () => {
    const newTodo = {
      id: +new Date(),
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    if (inputValue.trim() === '') {
      return;
    }

    setIsSubmiting(true);

    setTempTodo({
      id: 0,
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    });

    addTodo(newTodo)
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
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (inputValue.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      onSubmit();
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const dissableClearCompleted = () =>
    todos.every(element => !element.completed);

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
              disabled={dissableClearCompleted()}
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
