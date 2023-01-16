import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoAppFooter } from './components/TodoAppFooter';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodosList } from './components/TodosList';
import { SortType } from './types/SortType';

import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const isErrorDefault = {
    loadError: false,
    addError: false,
    deleteError: false,
    updateError: false,
    emptyTitleError: false,
  };

  const user = useContext(AuthContext) as User;
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [copyTodos, setCopyTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(isErrorDefault);
  const [selectParametr, setSelectParametr] = useState(SortType.all);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [deletedId, setDeletedId] = useState<number [] | null>(null);
  const activeTodosLength = useMemo(() => (
    copyTodos.filter(el => !el.completed).length
  ), [copyTodos]);

  const completedTodos
    = useMemo(() => (todos.filter(todo => todo.completed)), [copyTodos]);

  const completTodoLength = completedTodos.length;

  const isSomeError = Object.entries(isError).some(el => el[1] === true);
  const { id } = user;

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(id);

      setTodos(loadedTodos);
      setCopyTodos(loadedTodos);
      setIsError(isErrorDefault);
    } catch (error) {
      setIsError({ ...isError, loadError: true });
    }
  };

  const createTodo = async () => {
    setIsAdding(true);
    try {
      const createdTodo = await postTodo(newTodoTitle, id);

      setTodos([...todos, createdTodo]);
      setCopyTodos([...todos, createdTodo]);
    } catch {
      setIsError({ ...isError, addError: true });
    } finally {
      setNewTodo(null);
      setIsAdding(false);
    }
  };

  const deleteTodo = async (todoId: number[]) => {
    setDeletedId(todoId);
    let index: number[] = [];

    try {
      await Promise.all(todoId.map(el => removeTodo(el)));
      index = todoId.length === 1
        ? [todos.findIndex(todo => todo.id === todoId[0])]
        : completedTodos.map(el => todos.findIndex(item => el.id === item.id));

      const newTodos = todos.filter((_todo, i) => !index.includes(i));

      setTodos(newTodos);
      setCopyTodos(newTodos);
    } catch {
      setIsError({ ...isError, deleteError: true });
    } finally {
      setDeletedId(null);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = copyTodos
      .filter(todo => {
        switch (selectParametr) {
          case SortType.active:
            return !todo.completed;

          case SortType.completed:
            return todo.completed;

          default:
            return todo;
        }
      });

    setTodos(filteredTodos);
  }, [selectParametr, copyTodos]);

  const handlesSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodoTitle.length === 0) {
      setIsError({ ...isError, emptyTitleError: true });
    }

    setNewTodo({
      id: 0,
      userId: id,
      title: newTodoTitle,
      completed: false,
    });

    createTodo();
    setNewTodoTitle('');
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.currentTarget;
    const todoId = [+name];

    deleteTodo(todoId);
  };

  const handleDeleteCompleted = () => {
    deleteTodo(completedTodos.map(el => el.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          newTodoField={newTodoField}
          todosLength={todos.length}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handlesSubmit={handlesSubmit}
          isAdding={isAdding}
        />
        <TodosList
          todos={todos}
          newTodo={newTodo as Todo}
          isAdding={isAdding}
          handleDelete={handleDelete}
          deletedId={deletedId}
        />

        {(todos.length > 0 || selectParametr !== SortType.all) && (
          <TodoAppFooter
            selectParametr={selectParametr}
            setSelectParametr={setSelectParametr}
            activeTodosLength={activeTodosLength}
            completTodoLength={completTodoLength}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {isSomeError
        && (
          <ErrorNotification
            isError={isError}
            setIsError={setIsError}
            isErrorDefault={isErrorDefault}
          />
        )}
    </div>
  );
};
