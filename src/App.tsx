/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { useEffect, useState } from 'react';

const USER_ID = 11839;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filters.All);
  const [isErrorActive, setIsErrorActive] = useState<boolean>(false);

  const getFilteredTodos = (filterBy: Filters) => {
    let filteredTodos: Todo[] = [...todosFromServer];

    if (filterBy === Filters.Active) {
      filteredTodos = todosFromServer.filter((todo) => !todo.completed);
    }

    if (filterBy === Filters.Completed) {
      filteredTodos = todosFromServer.filter((todo) => todo.completed);
    }

    return filteredTodos;
  };

  const onFilterChange = (newFilter: Filters) => {
    setFilter(newFilter);
  };

  const preparedTodos = getFilteredTodos(filter);
  const errors = { error };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodosFromServer(data))
      .catch((err: Error) => {
        setError(err.message);
        setIsErrorActive(true);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todosFromServer={todosFromServer} />
        <TodoList preparedTodos={preparedTodos} />

        {(preparedTodos.length || filter !== Filters.All)
          && (
            <Footer
              todosFromServer={todosFromServer}
              filter={filter}
              onFilterChange={onFilterChange}
            />
          )}

        <Error
          errors={errors}
          isErrorActive={isErrorActive}
          setIsErrorActive={setIsErrorActive}
        />
      </div>
    </div>
  );
};


// const USER_ID = 0;

// export const App: React.FC = () => {
//   if (!USER_ID) {
//     return <UserWarning />;
//   }

//   return (
//     <section className="section container">
//       <p className="title is-4">
//         Copy all you need from the prev task:
//         <br />
//         <a href="https://github.com/mate-academy/react_todo-app-loading-todos#react-todo-app-load-todos">React Todo App - Load Todos</a>
//       </p>

//       <p className="subtitle">Styles are already copied</p>
//     </section>
//   );
// };


// updatefoo
// const updateGoodsHandler = useCallback((updatedTodo: Todo) => {
//   let prevTodo: Todo | null = null;

//   updateTodo(updatedTodo.id, { ...updatedTodo, id: undefined })
//     .catch(() => {
//       setTodos(prev => prev.map(todo => (
//         todo.id === updatedTodo.id && prevTodo ? prevTodo : todo
//       )));
//     });

//   setTodos(currentGoods => (
//     currentGoods.map(good => {
//       if (good.id === updatedTodo.id) {
//         prevTodo = good;
//       }

//       return good.id === updatedTodo.id ? updatedTodo : good;
//     })
//   ));
// }, []);

// add foo
// const addGoodHandler = useCallback((newTodo: Todo) => {
//   const temporaryTodo = {
//     ...newTodo,
//     id: Date.now(),
//   };

//   createTodo(newTodo)
//     .then((todo) => {
//       setTodos(prev => (
//         prev.map(t => t.id === temporaryTodo.id ? todo : t)
//       ));
//     })
//     .catch(() => setTodos(prev => (
//       prev.filter(t => t.id !== temporaryTodo.id))));

//   setTodos(prev => [temporaryTodo, ...prev]);
// }, []);
