import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  changeTodoStatus,
  createTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/Todo';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter_Enum';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodos, setFilterTodos] = useState<TodosFilter>(TodosFilter.All);

  const [alertText, setAlertText] = useState('');
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertTimerId, setAlertTimerId] = useState<NodeJS.Timeout | null>(null);

  const [isAdding, setAdding] = useState(false);

  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isLoadingTodosId, setLoadingTodosId] = useState<number[]>([]);

  const getFilteredTodos = () => {
    switch (filterTodos) {
      case TodosFilter.Active:
        return todos.filter((todo) => !todo.completed);
      case TodosFilter.Completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const clearAlert = () => {
    if (alertTimerId !== null) {
      clearTimeout(alertTimerId);
      setAlertTimerId(null);
    }

    setAlertVisible(false);
  };

  const showAlert = (error: string) => {
    clearAlert();
    setAlertText(error);
    setAlertVisible(true);
    setAlertTimerId(setTimeout(() => {
      setAlertVisible(false);
    }, 3000));
  };

  const handleClearAlert = () => clearAlert();

  const handleDeleteError = () => showAlert('Unable to add Todo');
  const handleUpdateError = () => showAlert('Unable to update Todo');
  const handleEmptyFieldError = () => showAlert('Title can\'t be empty');

  const addNewTodoToVisibleTodos = (todo?: Todo, title = 'temp') => {
    const newTodo = todo || {
      id: 0,
      title,
      completed: false,
      userId: 0,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const deleteVisibleTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
  };

  const addIsLoadingTodoId = (...ids: number[]) => {
    setLoadingTodosId((prevIds) => [...prevIds, ...ids]);
  };

  const deleteIsLoadingTodos = (...ids: number[]) => {
    setLoadingTodosId((prevIds) => prevIds.filter((id) => !ids.includes(id)));
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(todosFromServer => {
          setTodos(todosFromServer);
        })
        .catch(() => showAlert('Unable to get Todos'));
    }
  }, []);

  useEffect(() => {
    setVisibleTodos(getFilteredTodos());
  }, [todos, filterTodos]);

  const isInterfaceHidden = (todos.length === 0
    && filterTodos === TodosFilter.All);

  const handleFilterTodos = (filterValue: TodosFilter) => {
    setFilterTodos(filterValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodoTitle = newTodoField.current?.value.trim();

    if (newTodoTitle === '') {
      handleEmptyFieldError();
    }

    if (newTodoTitle !== '' && newTodoTitle && user) {
      clearAlert();
      setAdding(true);
      addNewTodoToVisibleTodos(undefined, newTodoTitle);
      addIsLoadingTodoId(0);
      createTodo({
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      })
        .then((todoFromServer) => {
          addNewTodoToVisibleTodos(todoFromServer);
          deleteIsLoadingTodos(0);
        })
        .catch(() => showAlert('Unable to add Todo'))
        .finally(() => {
          if (newTodoField.current) {
            newTodoField.current.value = '';
          }

          setAdding(false);
          deleteVisibleTodo(0);
        });
    }
  };

  const handleChangeStatus = (todoId: number, status: boolean) => {
    clearAlert();
    changeTodoStatus(todoId, !status)
      // .then(() => forceUpdate())
      .catch(() => showAlert('Unable to update Todo'));
  };

  const handleDeleteTodo = (todoId: number) => {
    clearAlert();
    addIsLoadingTodoId(todoId);
    deleteTodo(todoId)
      .then(() => deleteVisibleTodo(todoId))
      .catch(() => handleDeleteError())
      .finally(() => deleteIsLoadingTodos(todoId));
  };

  const handleToggleAllTodos = () => {
    const toggleValue = !todos.every((todo) => todo.completed);

    todos.forEach(({ id }) => {
      clearAlert();
      changeTodoStatus(id, toggleValue)
        // .then(() => forceUpdate())
        .catch(() => handleUpdateError());
    });
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    completedTodos.forEach(({ id }) => {
      clearAlert();
      addIsLoadingTodoId(id);
      deleteTodo(id)
        .then(() => deleteVisibleTodo(id))
        .catch(() => handleDeleteError())
        .finally(() => deleteIsLoadingTodos(id));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todos}
          newTodoField={newTodoField}
          handleToggleAllTodos={handleToggleAllTodos}
          handleSubmit={handleSubmit}
          isInterfaceHidden={isInterfaceHidden}
          isAdding={isAdding}
        />

        {
          !isInterfaceHidden && (
            <>
              <TodoList
                todos={visibleTodos}
                handleChangeStatus={handleChangeStatus}
                handleDeleteTodo={handleDeleteTodo}
                isLoadingTodosId={isLoadingTodosId}
              />

              <Footer
                todos={todos}
                filterTodos={filterTodos}
                handleFilterTodos={handleFilterTodos}
                handleDeleteCompleted={handleDeleteCompleted}
              />
            </>
          )
        }

        <ErrorNotification
          isAlertVisible={isAlertVisible}
          alertText={alertText}
          handleClearAlert={handleClearAlert}
        />
      </div>
    </div>
  );
};
