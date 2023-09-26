/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import {
  getTodos,
  deleteTodo,
  addTodo,
  toggleTodoCompleteState,
} from '../api/todos';
import { TodoType } from '../types/TodoType';
import Filter from './Filter';
import Todo from './Todo';
import { Status } from '../types/Status';

const USER_ID = 11554;

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeStatus, setActiveStatus] = useState<Status>(Status.All);
  const [toggleAll, setToggleAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const setTodoLoading = (id: number, isLoading: boolean) => {
    setLoading(prevLoadingTodos => {
      if (isLoading) {
        return [...prevLoadingTodos, id];
      }

      return prevLoadingTodos.filter(todoId => todoId !== id);
    });
  };

  const clearErrorButton = () => {
    setErrorMessage('');
  };

  const handleRequestError = (error: string) => {
    setErrorMessage(error);
    setTimeout(clearErrorButton, 3000);
  };

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then((response) => {
          setTodos(response);
        })
        .catch((error) => {
          handleRequestError('Unable to load todos');
          // eslint-disable-next-line no-console
          console.error('Error fetching todos:', error);
        });
    }
  }, []);

  useEffect(() => {
    const allCompleted = todos.every(todo => todo.completed);

    setToggleAll(allCompleted);
  }, [todos]);

  const newTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoRef.current) {
      newTodoRef.current.focus();
    }
  }, [isAddingTodo]);

  const handleNewTitle = (id: number, newTitle?: string) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            title: newTitle !== undefined
              ? newTitle
              : todo.title,
          };
        }

        return todo;
      });
    });
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const isAnyTodoCompleted = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    switch (activeStatus) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleFilterChange = (status: Status) => {
    setActiveStatus(status);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => {
        const updatedTodos = todos.filter(todo => !todo.completed);

        setTodos(updatedTodos);
      })
      .catch(error => {
        handleRequestError('Unable to delete a todo');
        // eslint-disable-next-line no-console
        console.error('Error clearing completed todos:', error);
      });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') {
      handleRequestError('Title should not be empty');

      return;
    }

    if (newTodo.trim() !== '') {
      const todoToAdd = {
        title: newTodo.trim(),
        completed: false,
        userId: USER_ID,
      };

      const tempTodoData = {
        id: 0,
        title: newTodo.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(tempTodoData);
      setIsAddingTodo(true);

      addTodo(todoToAdd)
        .then(responseTodo => {
          const updatedTodos = [...todos, responseTodo];

          setTodos(updatedTodos);
          setNewTodo('');
          setTempTodo(null);
          setIsAddingTodo(false);
          if (newTodoRef.current) {
            newTodoRef.current.focus();
          }
        })
        .catch(error => {
          handleRequestError('Unable to add a todo');
          setTempTodo(null);
          setIsAddingTodo(false);
          if (newTodoRef.current) {
            newTodoRef.current.focus();
          }

          // eslint-disable-next-line no-console
          console.error('Error adding todo:', error);
        });
    }
  };

  const handleToggle = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate) {
      const newCompletedStatus = !todoToUpdate.completed;

      toggleTodoCompleteState(id, newCompletedStatus)
        .then(updatedTodo => {
          const updatedTodos = todos.map(todo => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return todo;
          });

          setTodos(updatedTodos);
        })
        .catch(error => {
          handleRequestError('Unable to update a todo');
          // eslint-disable-next-line no-console
          console.error('Error toggling todo completion status:', error);
        });
    }
  };

  const toggleAllTodosCompleteState = () => {
    const areAllTodosCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllTodosCompleted,
    }));

    Promise.all(updatedTodos.map(
      todo => toggleTodoCompleteState(todo.id, !areAllTodosCompleted),
    ))
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error toggling all todo completion status:', error);
      });
  };

  const handleDelete = (id: number) => {
    deleteTodo(id)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);

        setTodos(updatedTodos);
      })
      .catch(error => {
        handleRequestError('Unable to delete a todo');
        // eslint-disable-next-line no-console
        console.error('Error deleting todo:', error);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${toggleAll ? 'active' : ' '}`}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodosCompleteState}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={isAddingTodo}
              ref={newTodoRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map((todo) => (
              <Todo
                loading={loading.includes(todo.id)}
                setTodoLoading={setTodoLoading}
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                handleNewTitle={handleNewTitle}
              />
            ))}
            {tempTodo && (
              <div key={0} data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                >
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => setTempTodo(null)}
                >
                  ×
                </button>
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Filter
              onFilterChange={handleFilterChange}
              activeStatus={activeStatus}
            />

            {isAnyTodoCompleted && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage !== '' ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrorButton}
        />
        {errorMessage}
      </div>
    </div>
  );
};
