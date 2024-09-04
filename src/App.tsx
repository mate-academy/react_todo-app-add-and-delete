import React, { FormEvent, useEffect, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
import { ErrorBox } from './components/ErrorBox';
import { Filter } from './utils/Filter';
import { filterTodos } from './utils/todoFilter';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorText } from './utils/ErrorText';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const prepedTodos = filterTodos(todos, filter);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isEveryActive =
    todos.every(todo => todo.completed) && todos.length !== 0;
  const haveCompleted = todos.some(todo => todo.completed);

  const createTodo = (
    event: FormEvent,
    todoText: string,
    setTodoText: (value: string) => void,
  ) => {
    event.preventDefault();
    const normalizeText = todoText
      .split(' ')
      .filter(symbol => symbol !== '')
      .join(' ');

    setIsLoading(true);
    if (!normalizeText) {
      setErrorMessage(ErrorText.TitleEmpty);
      setIsLoading(false);

      return;
    }

    setTempTodo({
      title: normalizeText,
      userId: USER_ID,
      completed: false,
      id: 0,
    });
    addTodo({ title: normalizeText, userId: USER_ID, completed: false })
      .then(currentTodo => {
        setTodos(prevTodos => [...prevTodos, currentTodo]);
        setTodoText('');
      })
      .catch(() => setErrorMessage(ErrorText.TodoAdd))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => setTodos(prevTodo => prevTodo.filter(elem => elem.id !== id)))
      .catch(() => setErrorMessage(ErrorText.TodoDelete))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteCompletedTodos = () => {
    setIsLoading(true);
    const filteredCompletedTodos = todos.filter(todo => todo.completed);

    setCompletedTodos(filteredCompletedTodos);
    Promise.all(
      filteredCompletedTodos.map(completedTodo =>
        deleteTodo(completedTodo.id)
          .then(() =>
            setTodos(prevTodos =>
              prevTodos.filter(prevTodo => prevTodo.id !== completedTodo.id),
            ),
          )
          .catch(() => setErrorMessage(ErrorText.TodoDelete))
          .finally(() => {
            setIsLoading(false);
            setCompletedTodos([]);
          }),
      ),
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isEveryActive={isEveryActive}
          createTodo={createTodo}
          isLoading={isLoading}
          todos={todos}
          errorMessage={errorMessage}
        />
        <TodoMain
          todos={prepedTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          completedTodos={completedTodos}
        />

        {!!todos.length && (
          <TodoFooter
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            filter={filter}
            haveCompleted={haveCompleted}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorBox errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
