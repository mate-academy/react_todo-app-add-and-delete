/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { wait } from './utils/fetchClient';
import { Todo as TodoElement } from './components/Todo';

// eslint-disable-next-line @typescript-eslint/naming-convention
enum ERROR_MESSAGE {
  serverError = 'Unable to load todos',
  emptyError = 'Title should not be empty',
  addError = 'Unable to add a todo',
  deleteError = 'Unable to delete a todo',
  updateError = 'Unable to update a todo',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
enum FILTER_STATUS {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [filteredData, setFilteredData] = useState<Todo[]>([]);
  const [fillterStatus, setFilterStatus] = useState(FILTER_STATUS.all);
  const [todoCounter, setTododCounter] = useState<number>(0);

  const [showErrorBox, setShowErrorBox] = useState(false);

  const [inputdisable, setInputdisable] = useState(false);
  const [idOfLoading, setIdOfLoading] = useState<number | null>(null);
  const [arrayIdsOfLoading, setArrayIdsOfLoading] = useState<number[]>([]);

  const [textOfError, setTextOfError] = useState<ERROR_MESSAGE | null>(null);
  const [todoInput, setTodoInput] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodoData)
      .catch(() => {
        setShowErrorBox(true);
        setTextOfError(ERROR_MESSAGE.serverError);
      });
  }, []);

  function addPost(title: string) {
    setInputdisable(true);
    // const localId = new Date().getTime();
    // const localData = {
    //   id: localId,
    //   userId: 690,
    //   title: title,
    //   completed: false,
    // };

    // setTodoData((prevData: Todo[]): Todo[] => {
    //   return [...prevData, localData];
    // });

    // setIdOfLoading(localId);

    const ownData = {
      userId: 690,
      title: title,
      completed: false,
    };

    wait(500)
      .then(() => {
        addTodo(ownData)
          .then((data: Todo) => {
            setTodoInput('');
            setTodoData((prevData: Todo[]): Todo[] => {
              return [data, ...prevData];
            });
          })
          .catch(() => {
            setShowErrorBox(true);
            setTextOfError(ERROR_MESSAGE.addError);
          });
      })
      .finally(() => {
        setTodoInput('');
        setInputdisable(false);
        setIdOfLoading(null);
      });
  }

  function deletePost(todoId: number) {
    setArrayIdsOfLoading(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then()
      .catch(() => {
        setShowErrorBox(true);
        setTextOfError(ERROR_MESSAGE.deleteError);
      });
    wait(500)
      .then(() => {
        setTodoData(prevData => prevData.filter(el => el.id !== todoId));
      })
      .finally();
  }

  function updatePost(todoId: number, info: Todo) {
    setTodoData((prevData: Todo[]): Todo[] => {
      const updatedData = prevData.map(el => {
        if (el.id === todoId) {
          return info;
        }

        return el;
      });

      return updatedData as Todo[];
    });

    wait(500).then(() => {
      updateTodo(todoId, info)
        .then((data: Todo[]) => {
          setTodoData((prevData: Todo[]): Todo[] => {
            const updatedData = prevData.map(el => {
              if (el.id === todoId) {
                return data;
              }

              return el;
            });

            return updatedData as Todo[];
          });
        })
        .catch(() => {
          setShowErrorBox(true);
          setTextOfError(ERROR_MESSAGE.updateError);
        });
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (todoInput.trim().length > 0) {
      addPost(todoInput);
    } else {
      setShowErrorBox(true);
      setTextOfError(ERROR_MESSAGE.emptyError);
    }
  }

  function clearAllCopmpleted(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    todoData.map(el => {
      if (el.completed) {
        deletePost(el.id);
      }
    });
  }

  useEffect(() => {
    wait(2000).then(() => {
      setShowErrorBox(false);
      setTextOfError(null);
    });
  }, [showErrorBox]);

  useEffect(() => {
    setTododCounter(todoData.filter(el => !el.completed).length);
  }, [todoData]);

  useEffect(() => {
    switch (fillterStatus) {
      case FILTER_STATUS.all:
        setFilteredData(todoData);
        break;
      case 'active':
        setFilteredData(todoData.filter(el => !el.completed));
        break;
      case 'completed':
        setFilteredData(todoData.filter(el => el.completed));
        break;
    }
  }, [fillterStatus, todoData]);

  const hasIncompleteTasks = todoData.some(el => !el.completed);

  const autoFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);

  const makeAllTaskAsComplited = () => {
    wait(500).then(() => {
      setTodoData(prev => {
        return prev.map(el => {
          if (!el.completed) {
            const updatedEl = { ...el, completed: true };

            updatePost(el.id, updatedEl);

            return updatedEl;
          }

          return el;
        });
      });
    });
  };

  const makeAllTaskAsActive = () => {
    wait(500).then(() => {
      setTodoData(prev => {
        return prev.map(el => {
          if (el.completed) {
            const updatedEl = { ...el, completed: false };

            updatePost(el.id, updatedEl);

            return updatedEl;
          }

          return el;
        });
      });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todoData.length > 0 && (
            <button
              onClick={
                hasIncompleteTasks
                  ? makeAllTaskAsComplited
                  : makeAllTaskAsActive
              }
              type="button"
              className={`todoapp__toggle-all ${!hasIncompleteTasks ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              disabled={inputdisable}
              ref={autoFocusRef}
              value={todoInput}
              onChange={e => setTodoInput(e.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredData.map(todo => {
            return (
              <TodoElement
                arrayIdsOfLoading={arrayIdsOfLoading}
                idOfLoading={idOfLoading}
                key={todo.id}
                todo={todo}
                deletePost={deletePost}
                updatePost={updatePost}
              />
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todoData.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todoCounter} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                onClick={() => setFilterStatus(FILTER_STATUS.all)}
                href="#/"
                className={`filter__link ${fillterStatus === FILTER_STATUS.all && 'selected'}`}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                onClick={() => setFilterStatus(FILTER_STATUS.active)}
                className={`filter__link ${fillterStatus === FILTER_STATUS.active && 'selected'}`}
                href="#/active"
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                onClick={() => setFilterStatus(FILTER_STATUS.completed)}
                className={`filter__link ${fillterStatus === FILTER_STATUS.completed && 'selected'}`}
                href="#/completed"
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              disabled={!todoData.some(el => el.completed)}
              onClick={clearAllCopmpleted}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!showErrorBox && 'hidden'}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {textOfError}
      </div>
    </div>
  );
};
