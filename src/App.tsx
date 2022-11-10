import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  createTodos,
  deleteTodos,
  UpdateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { TodoLIst } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorAdd, setErrorAdd] = useState(false);
  const [errorRemove, setErrorRemove] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(false);
  const [errorEmptyTitile, setErrorEmptyTitile] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [hidden, setHidden] = useState(true);
  const [isAdding, setIsAdding] = useState<Todo | null>(null);
  const [clearLoader, setClearLoader] = useState(false);
  const [loadingAllTodos, setLoadingAllTodos] = useState(false);
  const [isLoading, setIsLoading] = useState<Todo | null>(null);

  const handleHidden = useCallback(
    (value: boolean) => {
      setHidden(value);
    }, [],
  );

  const handleLoading = useCallback((value: Todo | null) => {
    setIsLoading(value);
  }, []);

  const handleTypeFilter = useCallback((type: string) => {
    setTypeFilter(type);
  }, []);

  const hanldeUpdateError = useCallback((value: boolean) => {
    setErrorUpdate(value);
  }, []);

  const handlerRemoveError = useCallback((value: boolean) => {
    setErrorRemove(value);
  }, []);

  const handlerNewTitle = useCallback((value: string) => {
    setNewTodoTitle(value);
  }, []);

  const foundTodoList = useCallback((u:User) => {
    getTodos(u.id).then(response => {
      setTodoList(response);
      setIsAdding(null);
      setClearLoader(false);
      setIsLoading(null);
      setLoadingAllTodos(false);
    });
  }, [user]);

  const createTodo = useCallback(
    async (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newTodoTitle.trim()) {
        setErrorEmptyTitile(true);
        setHidden(false);

        return;
      }

      if (user) {
        const newTodo = {
          userId: user.id,
          title: newTodoTitle,
          completed: false,
        };

        setIsAdding(newTodo);

        try {
          await createTodos(newTodo);
        } catch {
          setErrorAdd(true);
          setHidden(false);
        }

        foundTodoList(user);
        setNewTodoTitle('');
      }
    }, [newTodoTitle],
  );

  const checkedAllCompletedTodo = (list: Todo[]) => (
    list.every(todo => todo.completed)
  );

  const selectComplited = useCallback(async (todo:Todo) => {
    try {
      setIsLoading(todo);
      if (todo.completed) {
        await UpdateTodo(todo, false);
      } else {
        await UpdateTodo(todo, true);
      }
    } catch {
      setErrorUpdate(true);
      setHidden(false);
      setIsLoading(null);
    }

    if (user) {
      foundTodoList(user);
    }
  }, [todoList]);

  const selectAllTodos = useCallback(() => {
    todoList.map(async (todo) => {
      setLoadingAllTodos(true);
      if (!checkedAllCompletedTodo(todoList)) {
        if (!todo.completed) {
          selectComplited(todo);
        }
      } else {
        selectComplited(todo);
      }
    });
  }, [todoList]);

  const clearCompletedTodo = useCallback(() => {
    todoList.map(async (todo) => {
      if (todo.completed) {
        try {
          setClearLoader(true);
          await deleteTodos(todo);
        } catch {
          setErrorRemove(true);
          setHidden(false);
          setClearLoader(false);
        }

        if (user) {
          foundTodoList(user);
        }
      }
    });
  }, [todoList]);

  useEffect(() => {
    if (user) {
      foundTodoList(user);
    }
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const listFiltring = (list:Todo[]) => (
    list.filter(todo => {
      switch (typeFilter) {
        case 'Active':
          return !todo.completed;
        case 'Completed':
          return todo.completed;
        default:
          return todo;
      }
    }));

  const filtredList = useMemo(() => listFiltring(todoList),
    [typeFilter, todoList]);

  const handlerCloseErrors = useCallback(() => {
    setHidden(true);
    setErrorAdd(false);
    setErrorRemove(false);
    setErrorUpdate(false);
    setErrorEmptyTitile(false);
  }, [hidden]);

  useEffect(() => {
    setTimeout(handlerCloseErrors, 3000);
  }, [hidden]);

  const countingActiveTodo = (list: Todo[]) => (
    list.filter(todo => !todo.completed).length
  );

  const checkedComplitedTodo = (list: Todo[]) => (
    list.some(todo => todo.completed)
  );

  const selectErrors = (...args: boolean[]) => {
    const [EmptyTitile, Add, Remove, Update] = args;

    if (EmptyTitile) {
      return 'Title can\'t be empty';
    }

    if (Add) {
      return 'Unable to add a todo';
    }

    if (Remove) {
      return 'Unable to delete a todo';
    }

    if (Update) {
      return 'Unable to update a todo';
    }

    return null;
  };

  const hasComplitedTodo = useMemo(() => checkedComplitedTodo(todoList),
    [todoList]);
  const counterActiveTodos = useMemo(() => countingActiveTodo(todoList),
    [todoList]);
  const allComplited = useMemo(() => checkedAllCompletedTodo(todoList)
  && !!todoList.length,
  [todoList]);

  const errorMessage = useMemo(
    () => selectErrors(
      errorEmptyTitile,
      errorAdd,
      errorRemove,
      errorUpdate,
    ), [errorEmptyTitile, errorAdd, errorRemove, errorUpdate],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          allComplited={allComplited}
          selectAllTodos={selectAllTodos}
          createTodo={createTodo}
          newTodoTitle={newTodoTitle}
          onNewTodoTitle={handlerNewTitle}
        />

        <TodoLIst
          List={filtredList}
          onErrorRemove={handlerRemoveError}
          onErrorUpdate={hanldeUpdateError}
          onHidden={handleHidden}
          foundTodoList={foundTodoList}
          isAdding={isAdding}
          selectComplited={selectComplited}
          clearLoader={clearLoader}
          loadingAllTodos={loadingAllTodos}
          onIsLoading={handleLoading}
          isLoading={isLoading}
        />

        {!!todoList.length && (
          <Footer
            counterActiveTodos={counterActiveTodos}
            typeFilter={typeFilter}
            onTypeFilter={handleTypeFilter}
            hasComplitedTodo={hasComplitedTodo}
            clearCompletedTodo={clearCompletedTodo}
          />
        )}
      </div>

      <Error
        hidden={hidden}
        onCloseErrors={handlerCloseErrors}
        errorMessage={errorMessage}
      />
    </div>
  );
};
