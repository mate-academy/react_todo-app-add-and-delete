/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postCreateTodo, USER_ID } from './api/todos';
import { TempTodo, Todo } from './types/Todo';
import { TodoList } from './componentes/todolist';
import { TodoContext } from './context/todocontext';
import { TodoApp } from './componentes/todoApp';
import { FILTERS } from './filters/filter';
import classNames from 'classnames';
import 'bulma/css/bulma.css';

export const App: React.FC = () => {
  const [title, setTitle] = useState<string>('');

  const [todo, setTodo] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<TempTodo[] | null>([]);
  const [deletingIds, setDeletingsIds] = useState<number[]>([]);

  const { all, active, completed } = FILTERS;

  const [filter, setFilter] = useState<string>(all);

  const [isShowFooter, setIsShowFooter] = useState<boolean>(false);
  const [isShowActiveAll, setIsShowActiveAll] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [disableInput, setDisableInput] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle('');
  };

  const addTodo = ({ title: todoTitle, completed: isDone, userId }: Todo) => {
    setDisableInput(true);

    postCreateTodo({ title: todoTitle, completed: isDone, userId })
      .then(newTodo => {
        setTodo(currentTodos => [...currentTodos, newTodo]);
        reset();
      })
      .catch(() => {
        // toda requisiçao ao servidor deve vir acompanha de catch para tratamento de erros, e tbm response.ok
        setErrorMessage('Unable to add a todo');
        setIsError(true);
      })
      .finally(() => {
        setDisableInput(false);
        setTempTodo(null);
      });
    // como estou passando valor para os Sets, deve criar uma funçao anonima, abrir colchetes e atualizar os estados
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setIsError(true);
      setErrorMessage('Title should not be empty');

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
        setErrorMessage('Unable to delete a todo');
        setIsError(true);
        setDeletingsIds(loadingId => loadingId.filter(l => l !== id));
      });
  };

  const filteredTodo = todo.filter(t => {
    /* todo tem todos os elementos do array
        a unica coisa que filter faz é dizer: mostre os ativos, mostre todos, mostre os completos
        não posso filtrar o valor de todo e dar um setTodo pois isso vai subcrever os valores.
        */
    if (!t) {
      return false;
    } else if (filter === active) {
      /* - Se o filtro atual for "active", retorna true apenas para os itens
        não concluídos (t.completed === false).
  - Resultado: só tarefas ativas entram no array.
  */
      return t.completed === false;
    } else if (filter === completed) {
      /*- Se o filtro atual for "completed",
        retorna true apenas para os itens concluídos (t.completed === true).
  - Resultado: só tarefas concluídas entram no array.

        */
      return t.completed === true;
    }

    return true; /* - Se não for "active" nem "completed", cai aqui.
- Isso significa que o filtro é "all".
- Retorna true para todos os itens, ou seja, mantém todos no array.
 */
  });

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

    Promise.all(promises)
      .then(() => {
        setTodo(todo.filter(t => t.completed === false));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setIsError(true);
      })
      .finally(() => {
        // 5. DESLIGAR O LOADER (Limpamos os IDs que acabamos de processar)
        setDeletingsIds(prev =>
          prev.filter(id => !allcompletedIds.includes(id)),
        );
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
        setErrorMessage('Unable to load todos');
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    setIsShowFooter(todo.some(t => t && t.title && t.title.trim().length > 0));
  }, [todo]); // executado quando todo muda
  /* .some(callback) retorna verdadeiro true se callback retornar um valor verdadeiro para pelo menos um elemento na matriz,
    caso contrário , retorna falso.*/

  useEffect(() => {
    setIsShowActiveAll(
      todo.every(f => f.completed === true),
    ); /* toda vez que houver uma alteração na
    dependencia todo o useefect é ativado e faz a verificação do settIsShowActiveAll
    every verifica se todos são true, a condição que passei como callback, se todos forem true ele retorna true
    */
  }, [todo]);

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
  }, [isError]);

  useEffect(() => {
    if (!disableInput) {
      inputRef.current?.focus();
    }
  }, [disableInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {isShowFooter && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isShowActiveAll,
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
            filteredTodo,
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
          {isShowFooter && (
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
