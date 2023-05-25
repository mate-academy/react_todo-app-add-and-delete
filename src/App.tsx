import classNames from 'classnames';
import React, {
  useEffect, useState, FormEvent, useMemo,
} from 'react';
import { Todo } from './Types';
import { UserWarning } from './UserWarning';
import { getTodos } from './todos';
import { client } from './utils/client';

const USER_ID = 10377;

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1001);
}

enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThereActiveTodo, setIsThereActiveTodo] = useState(false);
  const [isThereCompletedTodos, setIsThereCompletedTodos] = useState(false);
  const [isAddingTodoAllowed, setIsAddingTodoAllowed] = useState(false);
  const [isDeleteingTodoAllowed, setIsDeleteingTodoAllowed] = useState(false);
  const [isEditingTodoAllowed, setIsEditingTodoAllowed] = useState(false);
  const [numberOfActiveTodos, setNumberOfActivTodos] = useState(0);
  const [errorMessageField, setErrorMessageField] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    userId: USER_ID,
    completed: false,
    id: getRandomNumber(),
  });

  const handleKeyPress
  = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      event.preventDefault();

      const updatedObjectTitle = {
        ...newTodo,
        title: event.target.value,
        id: getRandomNumber(),
      };

      setNewTodo(updatedObjectTitle);
      setTodo([...todo, updatedObjectTitle]);

      const resetedTitle = {
        ...newTodo,
        title: '',
        id: 0,
      };

      setNewTodo(resetedTitle);

      setInputValue(resetedTitle.title);

      try {
        await client.post('/todos', updatedObjectTitle);
      } catch (error) {
        throw Error('There is an issue.');
      }
    }

    if (event.key === 'Enter' && inputValue.trim() === '') {
      setIsAddingTodoAllowed(true);
      setErrorMessageField(true);
    }
  };

  const deleteTodo = async (id: number) => {
    const newTodos = todo.filter((element) => {
      return element.id !== id;
    });

    if (newTodos === todo) {
      setIsDeleteingTodoAllowed(true);
      setErrorMessageField(true);
    }

    setTodo(newTodos);

    try {
      await client.delete(`/todos/${id}`);
    } catch (error) {
      throw Error('There is an issue.');
    }
  };

  const changeAll = () => {
    const chnagedArr = todo.map((element) => {
      return {
        ...element,
        completed: !element.completed,
      };
    });

    setTodo(chnagedArr);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const searchTodo = async (id: number) => {
    const updatedTodo = todo.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          completed: !obj.completed,
        };
      }

      return obj;
    });

    const none = todo.some((element) => {
      return element.id === id;
    });

    if (!none) {
      setIsEditingTodoAllowed(true);
      setErrorMessageField(true);
    }

    setTodo(updatedTodo);

    try {
      const todoToUpdate = todo.find((elem) => elem.id === id);

      if (todoToUpdate) {
        await client.patch(`/todos/${id}`, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });
      }
    } catch (error) {
      throw Error('There is an issue.');
    }
  };

  const resetEverything = () => {
    const onlyActives = todo.filter((obj) => {
      return obj.completed === false;
    });

    setTodo(onlyActives);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await getTodos(123);

        setTodo(response);
      } catch (error) {
        throw Error('There is an issue.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    const isActive = todo.some((obj) => obj.completed === false);
    const isFalse = todo.some((obj) => obj.completed === true);
    const todoLength = todo.filter((obj) => {
      return obj.completed === false;
    });

    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isFalse);
    setNumberOfActivTodos(todoLength.length);
  }, [todo]);

  const visibleTodos: Todo[] = useMemo(() => todo.filter((element) => {
    switch (selectedTab) {
      case SortType.Completed:
        return element.completed;
      case SortType.Active:
        return !element.completed;
      case SortType.All:
        return todo;
      default:
        return todo;
    }
  }), [todo, selectedTab]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <label htmlFor="nameInput">
              <button
                id="nameInput"
                type="button"
                className={classNames('todoapp__toggle-all', {
                  active: isThereActiveTodo,
                })}
                onClick={changeAll}
              >
                {null}
              </button>
            </label>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyPress={handleKeyPress}
              />
            </form>
          </header>
          <section className="todoapp__main">
            {todo.length > 0 && (
              <>
                {visibleTodos.map((task) => {
                  if (!isLoading) {
                    return (
                      <div
                        className={classNames('todo', {
                          completed: task.completed,
                        })}
                        key={task.id}
                      >
                        <label className="todo__status-label" key={task.id}>
                          <input
                            type="checkbox"
                            className="todo__status todo__title-field"
                            value={newTodo.title}
                            checked={task.completed}
                            onChange={() => {
                              searchTodo(task.id);
                            }}
                          />
                        </label>
                        <span className="todo__title">
                          {task.title}
                        </span>
                        <button
                          type="button"
                          className="todo__remove"
                          onClick={() => deleteTodo(task.id)}
                        >
                          ×
                        </button>
                        <div className="modal overlay">
                          <div
                            className="modal-background
                             has-background-white-ter"
                          />
                        </div>
                      </div>
                    );
                  }

                  return <div className="loader" key={task.id} />;
                })}
              </>
            )}

          </section>

          {todo.length > 0 && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${numberOfActiveTodos} items left`}
              </span>

              <nav className="filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedTab === 'All',
                  })}
                  onClick={() => setSelectedTab(SortType.All)}
                  role="button"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedTab === 'Active',
                  })}
                  onClick={() => setSelectedTab(SortType.Active)}
                  role="button"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedTab === 'Completed',
                  })}
                  onClick={() => setSelectedTab(SortType.Completed)}
                  role="button"
                >
                  Completed
                </a>
              </nav>

              {isThereCompletedTodos ? (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={resetEverything}
                >
                  Clear completed
                </button>
              ) : <div className="todoapp__filler-div" />}
            </footer>
          )}

        </div>

        {errorMessageField && (
          <div
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              type="button"
              className="delete"
              onClick={() => {
                setIsDeleteingTodoAllowed(false);
                setIsAddingTodoAllowed(false);
                setIsEditingTodoAllowed(false);
                setErrorMessageField(false);
              }}
            >
              {null}
            </button>

            {isAddingTodoAllowed && (
              'Unable to add a todo'
            )}

            <br />
            {isDeleteingTodoAllowed && (
              'Unable to delete a todo'
            )}
            <br />
            {isEditingTodoAllowed && (
              'Unable to update a todo'
            )}
          </div>
        )}
      </div>
    </>
  );
};
