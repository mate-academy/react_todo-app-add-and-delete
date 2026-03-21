/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './componentes/todolist';
import { TodoContext } from './context/todocontext';
import { TodoApp } from './componentes/todoApp';
import { FILTERS } from './filters/filter';
import classNames from 'classnames';
import 'bulma/css/bulma.css';
import { getFilteredTodo } from './utils/filteredtodo';
import { useTodo } from './utils/useTodo';

export const App: React.FC = () => {
  const {
    todo,
    tempTodo,
    errorMessage,
    isError,
    disableInput,
    title,
    setTodo,
    addTodo,
    setTempTodo,
    setTitle,
    setErrorMessage,
    setIsError,
  } = useTodo([]);

  const [deletingIds, setDeletingsIds] = useState<number[]>([]);

  const { all, active, completed } = FILTERS;

  const [filter, setFilter] = useState<string>(all);

  const inputRef = useRef<HTMLInputElement>(null);

  const getError = (message: string) => {
    setErrorMessage(message);
    setIsError(true);
  };

  const isActive = todo.every(f => f.completed === true);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      getError('Title should not be empty');

      return;
    }

    addTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    setTempTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    });
  };

  const handleSelected = (id: number) => {
    const newArray = todo.map(i => {
      if (i.id === id) {
        return { ...i, completed: !i.completed };
      }

      return i;
    });

    setTodo(newArray);
  };

  const handleRemove = (id: number) => {
    setDeletingsIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodo(currentTodo => currentTodo.filter(t => t.id !== id));
      })
      .catch(() => {
        getError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingsIds(loadingId => loadingId.filter(l => l !== id));
        inputRef.current?.focus();
      });
  };

  const handleActiveAll = () => {
    const allCompleted = todo.every(
      t => t.completed === true,
    ); /* retorna true se todos t.completed forem true*/

    const newArray = todo.map(t => {
      return {
        ...t,
        completed: !allCompleted,
      }; /* completed sera sobrescrevido com a negação do allcompleted, assim
       conseguimos alternar entre false e true, o spreed copiará todas as propriedades */
    });

    setTodo(newArray);
  };

  const handleFilterAll = () => setFilter(all);

  const handleActive = () => setFilter(active);

  const handleCompleted = () => setFilter(completed);

  const handleRemoveCompleted = () => {
    const allcompletedIds = todo.filter(t => t.completed).map(t => t.id); // [a, b, c, d]

    setDeletingsIds(prev => [...prev, ...allcompletedIds]);
    const promises = allcompletedIds.map(id => deleteTodo(id));

    Promise.allSettled(promises)
      .then(results => {
        const failedIds = allcompletedIds.filter(
          (id, index) => results[index].status === 'rejected',
        );

        if (failedIds.length > 0) {
          getError('Unable to delete a todo');
        }

        setTodo(currentTodo =>
          currentTodo.filter(
            t => !allcompletedIds.includes(t.id) || failedIds.includes(t.id),
          ),
        );
      })
      .finally(() => {
        // 5. DESLIGAR O LOADER (Limpamos os IDs que acabamos de processar)
        setDeletingsIds(prev =>
          prev.filter(id => !allcompletedIds.includes(id)),
        );
        inputRef.current?.focus();
      });
  };

  const handleCloseButton = () => {
    setIsError(false);
  };

  useEffect(() => {
    getTodos()
      .then(todosVindoDaApi => {
        /* getTodos armazena todas as tarefas. todosVindoDaApi é
      quando um calculo assincrono é executado, ele passa seu resultado para a função que é o primeiro argumento de then  */
        setTodo(todosVindoDaApi);
      })
      .catch(() => {
        getError('Unable to load todos');
      });
  }, [getError, getTodos]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    const timerId = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isError, setIsError]);

  useEffect(() => {
    if (!disableInput) {
      inputRef.current?.focus();
    }
  }, [disableInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilteredTodo(todo, filter); // visibleTodos é uma constante que guarda o valor da função getFilteredTodo

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todo.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isActive,
              })}
              data-cy="ToggleAllButton"
              onClick={() => handleActiveAll()}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitle}
              autoFocus
              disabled={disableInput}
            />
          </form>
        </header>
        <TodoContext.Provider
          value={{
            todo,
            setTodo,
            handleSelected,
            handleRemove,
            visibleTodos,
            handleRemoveCompleted,
            filter,
            handleActive,
            handleCompleted,
            handleFilterAll,
            tempTodo,
            deletingIds,
          }}
        >
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList />
          </section>

          {/* Hide the footer if there are no todos */}
          {todo.length > 0 && (
            <footer className="todoapp__footer" data-cy="Footer">
              <TodoApp />
            </footer>
          )}
        </TodoContext.Provider>
      </div>
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isError },
        )} // false esconde e true mostra
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseButton}
        />
        {/* show only one message at a time */}
        <div>{errorMessage}</div>
      </div>
    </div>
  );
};
