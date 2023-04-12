import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { filterTodos } from './utils/helpers/filterTodos';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { ErrorMessage } from './Components/ErrorMessage/ErrorMessage';
import { USER_ID } from './utils/UserID';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filteredBy, setFilteredBy] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [titleTodo, setTitleTodo] = useState('');
  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeInput, setActiveInput] = useState(true);

  const visibleTodos = useMemo(() => {
    return filterTodos(todoList, filteredBy);
  }, [todoList, filteredBy]);

  const handleChangeFilterBy = (value: string) => {
    setFilteredBy(value);
  };

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    setTitleTodo(value);
  };

  const fetchTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setTodoList(todos);
    } catch {
      setErrorMessage('Unable to add a todo');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todoList}
          setTodoList={setTodoList}
          title={titleTodo}
          handleChangeTitle={handleChangeTitleTodo}
          setTitleTodo={setTitleTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
        />

        <TodoList
          todos={visibleTodos}
          setTodoList={setTodoList}
          setErrorMessage={setErrorMessage}
          deletedTodos={deletedTodos}
          setDeletedTodos={setDeletedTodos}
          tempTodo={tempTodo}
        />

        {todoList.length > 0 && (
          <Footer
            setTodoList={setTodoList}
            filteredBy={filteredBy}
            todosLengh={visibleTodos.length}
            handleChangeFilterType={handleChangeFilterBy}
            todos={visibleTodos}
            setErrorMessage={setErrorMessage}
            setDeletedTodos={setDeletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
