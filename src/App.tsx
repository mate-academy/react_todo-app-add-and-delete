import React, { useState, useEffect, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  getTodos,
  postTodo,
  patchTodo,
  deleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Filter } from './types/Filter';
import { ErrorsMessages } from './types/ErrorsMessages';
import { UserWarning } from './UserWarning';

const USER_ID = 6725;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHeaderDisabled, setIsHeaderDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [processings, setProcessings] = useState<number[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>('all');

  const removeMessage = () => {
    setErrorMessage('');
  };

  const createErrorMessage = (title: ErrorsMessages) => {
    setErrorMessage(title);
  };

  const showErrorMessage = (message: ErrorsMessages) => {
    createErrorMessage(message);
    setTimeout(() => (removeMessage()), 3000);
  };

  const loadTodos = async () => {
    setErrorMessage('');

    try {
      const dataFromServer = await getTodos();

      setTodos(dataFromServer);
    } catch (error) {
      showErrorMessage(ErrorsMessages.Load);
    }
  };

  const setFilter = (filter: Filter) => {
    setCurrentFilter(filter);
  };

  const filterTodos = (filteringProperty: Filter) => {
    return (
      filteringProperty === 'all'
        ? todos
        : todos.filter(todo => {
          switch (filteringProperty) {
            case 'active':
              return !todo.completed;
            case 'completed':
              return todo.completed;
            default:
              return null;
          }
        })
    );
  };

  const filteredTodos: Todo[] = useMemo(
    () => filterTodos(currentFilter),
    [todos, currentFilter],
  );

  const addTodo = async (newTodoTitle: string) => {
    setErrorMessage('');
    setIsHeaderDisabled(true);

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      });
      const newTodoPost = await postTodo({
        title: newTodoTitle,
        userId: 6725,
        completed: false,
      });

      setTodos((items) => [...items, newTodoPost]);
    } catch (error) {
      showErrorMessage(ErrorsMessages.Post);
    }

    setTempTodo(undefined);
    setIsHeaderDisabled(false);
  };

  const filterTodosById = (todoElements: Todo[], id: number) => {
    return todoElements.filter((item) => item.id !== id);
  };

  const removeTodo = async (id: number) => {
    setErrorMessage('');
    setProcessings((prev) => [...prev, id]);

    try {
      const response = await deleteTodo(id);

      if (response) {
        setTodos(filterTodosById(todos, id));
      }
    } catch (error) {
      showErrorMessage(ErrorsMessages.Delete);
    }

    setProcessings([]);
  };

  const removeCompletedTodos = async () => {
    setErrorMessage('');

    const completedTodos = (
      todos.filter(el => el.completed)
        .map(item => item.id)
    );

    setProcessings(completedTodos);

    try {
      const removed = await Promise.all(
        completedTodos.map(el => deleteTodo(el)),
      );

      if (removed) {
        setTodos((prev) => {
          return prev.filter((todo) => !todo.completed);
        });
      }
    } catch (error) {
      showErrorMessage(ErrorsMessages.Delete);
    }

    setProcessings([]);
  };

  const handleChecker = async (id: number, data: unknown) => {
    setErrorMessage('');
    setProcessings((prev) => [...prev, id]);

    try {
      const response = await patchTodo(id, data);
      const todoEdited = todos.find((todo) => todo.id === id);
      const isTitleChanged = response.title !== todoEdited?.title;
      const isCompletedChanged = response.completed !== todoEdited?.completed;

      if (isTitleChanged || isCompletedChanged) {
        setTodos((oldTodos) => {
          const newTodos = oldTodos.map((el) => ({
            ...el,
            completed: el.id === id ? response.completed : el.completed,
            title: el.id === id ? response.title : el.title,
          }));

          return (
            newTodos
          );
        });
      }
    } catch (error) {
      showErrorMessage(ErrorsMessages.Update);
    }

    setProcessings([]);
  };

  const handlerSwitch = async (AllChecked: boolean) => {
    setErrorMessage('');

    const todosIdArray = (
      AllChecked ? (
        todos.map(item => item.id)
      ) : (
        todos.filter(el => !el.completed)
          .map(item => item.id)
      )
    );

    setProcessings(todosIdArray);

    try {
      const changedElements = (!AllChecked
        ? await Promise.all(
          todosIdArray.map(el => patchTodo(el, { completed: true })),
        ) : (
          await Promise.all(
            todosIdArray.map(el => patchTodo(el, { completed: false })),
          )
        ));

      if (changedElements) {
        setTodos((oldTodos) => {
          const newTodos = oldTodos.map((el) => ({
            ...el,
            completed: (
              todosIdArray.includes(el.id)
                ? !el.completed
                : el.completed
            ),
          }));

          return (
            newTodos
          );
        });
      }
    } catch (error) {
      showErrorMessage(ErrorsMessages.Update);
    }

    setProcessings([]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const isFooterVisible = !!todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TransitionGroup>
      <CSSTransition
        key={0}
        timeout={300}
        classNames="has-error"
      >
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              todos={todos}
              addTodo={addTodo}
              switchBtn={handlerSwitch}
              errorMessage={showErrorMessage}
              disabled={isHeaderDisabled}
            />
            <Main
              todos={filteredTodos}
              handleChecker={handleChecker}
              removeTodo={removeTodo}
              processings={processings}
              errorMessage={showErrorMessage}
              tempTodo={tempTodo}
            />
            {isFooterVisible && (
              <Footer
                todos={todos}
                filter={setFilter}
                currentFilter={currentFilter}
                removeCompletedTodos={removeCompletedTodos}
              />
            )}
          </div>
          <Error
            errorMessage={errorMessage}
            removeMessage={removeMessage}
          />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
