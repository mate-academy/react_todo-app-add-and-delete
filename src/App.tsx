/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

//#region imports
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { SelectedFilter } from './types/SelectedFilter';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
// eslint-disable-next-line
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
//#endregion

const ERROR_DELAY = 3000;

export const App: React.FC = () => {
  //#region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [creatingTodo, setCreatingTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<SelectedFilter>(SelectedFilter.ALL);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(false);

  const [loadingIds, setLoadingIds] = useState<number[]>([0]);

  const inputRef = useRef<HTMLInputElement>(null);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (!isDisabledInput && inputRef.current && loadingIds) {
      inputRef.current.focus();
    }
  }, [isDisabledInput, loadingIds]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), ERROR_DELAY);
      });
  }, []);
  //#endregion

  //#region serverRequest
  async function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setIsDisabledInput(true);

    setCreatingTodo({
      id: 0,
      title: title,
      userId: todoService.USER_ID,
      completed: false,
    });

    try {
      const newPost = await todoService.addTodo({ title, userId, completed });

      setTodos(prev => [...prev, newPost]);
      setQuery('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setIsDisabledInput(false);
      setTimeout(() => setErrorMessage(''), ERROR_DELAY);
    } finally {
      setCreatingTodo(null);
      setIsDisabledInput(false);
    }
  }

  async function deleteTodo(todoId: number) {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => setErrorMessage(''), ERROR_DELAY);
    } finally {
      setLoadingIds(loadingIds.filter(id => id !== todoId));
    }
  }

  const massDelete = async (todoIds: number[]) => {
    await Promise.all(
      todoIds.map(todoId => {
        deleteTodo(todoId);
      }),
    );
  };
  //#endregion

  //#region eventHandlers
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim()) {
      addTodo({
        title: query.trim(),
        userId: todoService.USER_ID,
        completed: false,
      });
    } else {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), ERROR_DELAY);
    }
  };

  const handleResetErrorMessage = () => {
    setErrorMessage('');
  };

  const handleChangeCheckbox = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleSetFilter = (filterType: SelectedFilter) => {
    setFilter(filterType);
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  //#endregion

  //#region helperFunctions
  const isOneActive = () => {
    return todos.filter(todo => todo.completed);
  };

  const isAllActive = () => {
    for (const todo of todos) {
      if (!todo.completed) {
        return false;
      }
    }

    return true;
  };

  const getIdOfCompletedTodos = () => {
    const completedId = [];

    for (const todo of todos) {
      if (todo.completed) {
        completedId.push(todo.id);
      }
    }

    return completedId;
  };

  const itemsLeft = () => {
    const leftItems = todos.length - isOneActive().length;

    return `${leftItems} ${leftItems === 1 ? 'item' : 'items'} left`;
  };
  //#endregion

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case SelectedFilter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case SelectedFilter.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filter, todos]);

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          isAllActive={isAllActive}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          isDisabledInput={isDisabledInput}
          query={query}
          handleChange={handleChangeQuery}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map((todo: Todo) => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  onChangeCheckbox={id => handleChangeCheckbox(id)}
                  onDelete={deleteTodo}
                  loadingIds={loadingIds}
                />
              </CSSTransition>
            ))}

            {creatingTodo !== null && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem todo={creatingTodo} loadingIds={loadingIds} />
              </CSSTransition>
            )}

            <>
              {/* This todo is being edited */}
              {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}
              {/* This form is shown instead of the title and remove button */}
              {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                // value="Todo is being edited now"
                // remove error from console
                defaultValue="Todo is being edited now"
              />
            </form> */}
              {/* <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
              {/* This todo is in loadind state */}
              {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              x
            </button> */}
              {/* 'is-active' class puts this modal on top of the todo */}
              {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
            </>
          </TransitionGroup>
        </section>
        {/* Hide the footer if there are no todos */}
        {(todos.length !== 0 || creatingTodo) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <Footer
              itemsLeft={itemsLeft()}
              filter={filter}
              massDelete={massDelete(getIdOfCompletedTodos())}
              isOneActive={isOneActive}
              onSetFilter={handleSetFilter}
            />
          </footer>
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        handleCloseError={handleResetErrorMessage}
      />
    </div>
  );
};
