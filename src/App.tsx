/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { sendErrorMessage } from './components/errorsUnderFooter';
import { useRef } from 'react';
import { Footer } from './components/footer';
import { ErrorMessage } from './components/errorsUnderFooter';
import { MainSection } from './components/section';
import { Header } from './components/header';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [loader, setLoader] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodoList(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, deletingTodos]);

  const filterTodos = useMemo(() => {
    switch (selectedFilter) {
      case Filter.Active:
        return todoList.filter(todo => !todo.completed);
      case Filter.Completed:
        return todoList.filter(todo => todo.completed);
      case Filter.All:
      default:
        return todoList;
    }
  }, [todoList, selectedFilter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleToggleCompletion(todoId: number) {
    setTodoList(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function submitTodo(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim() === '') {
      sendErrorMessage('Title should not be empty', setErrorMessage);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoader(true);

    postTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(data => {
        setTodoList(preTodoList => [...preTodoList, data]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        sendErrorMessage('Unable to add a todo', setErrorMessage);
      })
      .finally(() => {
        setLoader(false);
      });
  }

  async function handleDeleteTodo(todoId: number) {
    setDeletingTodos(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodoList(prevTodoList =>
        prevTodoList.filter(todo => todo.id !== todoId),
      );
    } catch {
      sendErrorMessage('Unable to delete a todo', setErrorMessage);
    } finally {
      setDeletingTodos(prev => prev.filter(id => id !== todoId));
    }
  }

  const handleDeleteCompletedTodo = async () => {
    const completedTodoIds = todoList
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodos(prev => [...prev, ...completedTodoIds]);

    let hasError = false;

    for (const id of completedTodoIds) {
      try {
        await deleteTodo(id);
        setTodoList(prev => prev.filter(todo => todo.id !== id));
      } catch {
        hasError = true;
      }
    }

    setDeletingTodos(prev => prev.filter(id => !completedTodoIds.includes(id)));

    if (hasError) {
      sendErrorMessage('Unable to delete a todo', setErrorMessage);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          filteredTodoList={filterTodos}
          submitTodo={submitTodo}
          inputRef={inputRef}
          title={title}
          handleChangeInput={handleChangeInput}
          loader={loader}
        />

        <MainSection
          filteredTodoList={filterTodos}
          deletingTodos={deletingTodos}
          handleToggleCompletion={handleToggleCompletion}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
        />

        {todoList.length > 0 && (
          <Footer
            todoList={todoList}
            selectedFilter={selectedFilter}
            setSelectedFilter={(filter: Filter) => setSelectedFilter(filter)}
            handleDeleteCompletedTodo={handleDeleteCompletedTodo}
          />
        )}
      </div>

      <ErrorMessage
        message={errorMessage}
        clearMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
