import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Todo, SortType } from './Types';
import { UserWarning } from './UserWarning';
import { getTodos } from './todos';
import { client } from './utils/client';
import { ErrorMessage } from './components/ErrorMessages';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const USER_ID = 10377;

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1001);
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [apiResponseReceived, setApiResponseReceived] = useState(false);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [isThereActiveTodo, setIsThereActiveTodo] = useState(false);
  const [isPlusOne, setIsPlusOne] = useState(false);
  const [isEveryThingDelete, setIsEveryThingDelete] = useState(false);
  const [isThereCompletedTodos, setIsThereCompletedTodos] = useState(false);
  const [isHidden, setIsHidden] = useState('');
  const [isThereIssue, setIsThereIssue] = useState(false);
  const [numberOfActiveTodos, setNumberOfActiveTodos] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos(USER_ID);

      setTodos(response);
      setApiResponseReceived(true);
    } catch (error) {
      setIsHidden('Unable to load todos');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
      throw Error('Unable to load todos');
    } finally {
      setIsLoading(false);
      setApiResponseReceived(false);
    }
  };

  const updateTempTodo = (value: string) => {
    setInputValue(value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsThereIssue(false);
    setIsLoading(true);
    setIsPlusOne(true);

    setTempTodo({
      ...tempTodo,
      title: inputValue.trim(),
      id: 0,
      completed: false,
      userId: USER_ID,
    });

    if (inputValue.trim() !== '') {
      const tempTodoItem: Todo = {
        title: inputValue.trim(),
        userId: USER_ID,
        completed: false,
        id: getRandomNumber(),
      };

      try {
        await client.post('/todos', tempTodoItem);
        setTodos((prevTodo) => [...prevTodo, tempTodoItem]);
        setApiResponseReceived(true);
      } catch (error) {
        setIsThereIssue(true);
        setDeleteErrorMessage('Unable to add the todo');
        timeoutId.current = setTimeout(() => {
          setIsThereIssue(false);
        }, 3000);
        setIsPlusOne(false);
        throw Error('Unable to add a todo');
      } finally {
        setApiResponseReceived(false);
        setIsLoading(false);
        setIsPlusOne(false);
      }
    } else {
      setIsThereIssue(true);
      setIsPlusOne(false);
      setIsTitleEmpty('Title can\'t be empty');
    }

    setInputValue('');
  };

  const deleteTodo = async (id: number) => {
    setDeletedTodoId(id);

    try {
      setIsLoading(true);
      await client.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setDeleteErrorMessage('Unable to delete the todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
      setIsLoading(false);
      throw Error('Unable to delete the todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    const isActive = todos.some((obj) => !obj.completed);
    const isCompleted = todos.some((obj) => obj.completed);
    const todoLength = todos.filter((obj) => {
      return obj.completed === false;
    });

    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isCompleted || false);
    setNumberOfActiveTodos(todoLength.length);
  }, [todos]);

  const visibleTodos: Todo[] = useMemo(() => todos.filter((element) => {
    switch (selectedTab) {
      case SortType.Completed:
        return element.completed;
      case SortType.Active:
        return !element.completed;
      case SortType.All:
      default:
        return todos;
    }
  }), [todos, selectedTab]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            isThereActiveTodo={isThereActiveTodo}
            handleFormSubmit={handleFormSubmit}
            updatetempTodo={updateTempTodo}
            apiResponseReceived={apiResponseReceived}
            tempTodo={inputValue}
          />
          <section className="todoapp__main">
            <TodoList
              todo={todos}
              isEveryThingDelete={isEveryThingDelete}
              visibleTodos={visibleTodos}
              isLoading={isLoading}
              deleteTodo={deleteTodo}
              deletedTodoId={deletedTodoId}
              isPlusOne={isPlusOne}
              tempTodo={tempTodo}
              isThereIssue={isThereIssue}
            />
          </section>
          {todos.length > 0 && (
            <Footer
              numberOfActiveTodos={numberOfActiveTodos}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              setIsEveryThingDelete={setIsEveryThingDelete}
              isThereCompletedTodos={isThereCompletedTodos}
              todo={todos}
              setTodos={setTodos}
              setDeleteErrorMessage={setDeleteErrorMessage}
            />
          )}

        </div>

        <ErrorMessage
          loadError={isHidden}
          deleteErrorMessage={deleteErrorMessage}
          isThereIssue={isThereIssue}
          setIsThereIssue={setIsThereIssue}
          isTitleEmpty={isTitleEmpty}
        />
      </div>
    </>
  );
};
