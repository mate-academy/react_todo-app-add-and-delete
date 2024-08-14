/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { wait } from './utils/fetchClient';
import { Todo as TodoElement } from './components/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

import cn from 'classnames';

const WAIT_TIME = 500;

// eslint-disable-next-line @typescript-eslint/naming-convention
enum ERROR_MESSAGE {
  serverError = 'Unable to load todos',
  emptyError = 'Title should not be empty',
  addError = 'Unable to add a todo',
  deleteError = 'Unable to delete a todo',
  updateError = 'Unable to update a todo',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FILTER_STATUS {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [filteredData, setFilteredData] = useState<Todo[]>([]);
  const [fillterStatus, setFilterStatus] = useState<FILTER_STATUS>(
    FILTER_STATUS.all,
  );
  const [todoCounter, setTododCounter] = useState<number>(0);

  const [showErrorBox, setShowErrorBox] = useState(false);

  const [isInputDisable, setIsInputDisable] = useState(false);
  const [arrayIdsOfLoading, setArrayIdsOfLoading] = useState<number[]>([]);

  const [textOfError, setTextOfError] = useState<ERROR_MESSAGE | null>(null);
  const [todoInput, setTodoInput] = useState('');

  const isFirstRender = useRef(true);
  const autoFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, [isInputDisable]);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodoData(data);
        setTododCounter(data.filter(el => !el.completed).length);
      })
      .catch(() => {
        setShowErrorBox(true);
        setTextOfError(ERROR_MESSAGE.serverError);
      });
  }, []);

  function addPost(title: string) {
    setIsInputDisable(true);
    // Create a temporary Todo item with a unique temporary id (e.g., -1)
    const tempTodo: Todo = {
      id: -1, // temporary id
      userId: 690,
      title: title.trim(),
      completed: false,
    };

    // Add the temporary Todo item to the state immediately
    setTodoData((prevData: Todo[]): Todo[] => {
      return [...prevData, tempTodo];
    });

    setArrayIdsOfLoading(prev => [...prev, tempTodo.id]);

    addTodo({
      userId: 690,
      title: title.trim(),
      completed: false,
    })
      .then((data: Todo) => {
        // Replace the temporary Todo with the actual data from the response
        setTodoData((prevData: Todo[]): Todo[] => {
          return prevData.map(todo => (todo.id === tempTodo.id ? data : todo));
        });
        setArrayIdsOfLoading(prev => [...prev, data.id]);
        wait(WAIT_TIME)
          .then(() => {
            setTodoInput('');
            setIsInputDisable(false);
          })
          .finally(() => {
            setArrayIdsOfLoading([]);
          });
      })
      .catch(() => {
        setShowErrorBox(true);
        setTextOfError(ERROR_MESSAGE.addError);
        setIsInputDisable(false);

        // Optionally, remove the temporary Todo item if there's an error
        setTodoData((prevData: Todo[]): Todo[] => {
          return prevData.filter(todo => todo.id !== tempTodo.id);
        });
      })
      .finally(() => {});
  }

  function deletePost(todoId: number) {
    setArrayIdsOfLoading(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodoData(prevData => prevData.filter(el => el.id !== todoId));
      })
      .catch(() => {
        setShowErrorBox(true);
        setTextOfError(ERROR_MESSAGE.deleteError);
      })
      .finally(() => {
        setArrayIdsOfLoading([]);

        // Refocus the input field after deletion
        if (autoFocusRef.current) {
          autoFocusRef.current.focus();
        }
      });
  }

  function updatePost(todoId: number, info: Todo) {
    setArrayIdsOfLoading(prevId => [...prevId, todoId]);
    wait(WAIT_TIME).then(() => {
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
        })
        .finally(() => {
          setArrayIdsOfLoading([]);
        });
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoInput.trim().length > 0) {
      addPost(todoInput);
    } else {
      setShowErrorBox(true);
      setTextOfError(ERROR_MESSAGE.emptyError);
    }
  };

  const clearAllCopmpleted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    todoData.map(el => {
      if (el.completed) {
        deletePost(el.id);
      }
    });
  };

  useEffect(() => {
    wait(2000).then(() => {
      setShowErrorBox(false);
      setTextOfError(null);
    });
  }, [showErrorBox]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      wait(WAIT_TIME).then(() => {
        setTododCounter(todoData.filter(el => !el.completed).length);
      });
    }
  }, [todoData]);

  useEffect(() => {
    switch (fillterStatus) {
      case FILTER_STATUS.all:
        setFilteredData(todoData);
        break;
      case FILTER_STATUS.active:
        setFilteredData(todoData.filter(el => !el.completed));
        break;
      case FILTER_STATUS.completed:
        setFilteredData(todoData.filter(el => el.completed));
        break;
    }
  }, [fillterStatus, todoData]);

  const makeAllTaskAsComplited = () => {
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
  };

  const makeAllTaskAsActive = () => {
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
  };

  const clearButton = !todoData.some(el => el.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoData={todoData}
          makeAllTaskAsActive={makeAllTaskAsActive}
          makeAllTaskAsComplited={makeAllTaskAsComplited}
          handleSubmit={handleSubmit}
          isInputDisable={isInputDisable}
          autoFocusRef={autoFocusRef}
          todoInput={todoInput}
          setTodoInput={setTodoInput}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredData.map(todo => {
            return (
              <TodoElement
                arrayIdsOfLoading={arrayIdsOfLoading}
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
          <Footer
            todoCounter={todoCounter}
            fillterStatus={fillterStatus}
            setFilterStatus={setFilterStatus}
            clearButton={clearButton}
            clearAllCopmpleted={clearAllCopmpleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${cn({ hidden: !showErrorBox })}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {textOfError}
      </div>
    </div>
  );
};
