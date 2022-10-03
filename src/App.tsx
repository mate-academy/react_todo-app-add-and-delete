// как отображать лоудер на конкретной тудушке и при этом не показывать 3 секунды стандартную верстку
// чтобы лоудер сам крутился 3 сек и был на центре а не слева сбоку
// что по условию задачи делает newTodoField и что мне с ним делать
// и ошибки не могу сделать
// при удалении ошибка появляется до нажатии на кнопку удаления так как ошибка происходит в промисе или это несвязано между собой
// это нормально что при кетч у меня все равно ошибки в консоле
// вся проблема что она вылазит раньше нажатия но после первого раза потом нормально работает
// сделал на костылях через доп стейт счетчик но надо сделать нормально
// когда не смог загрузить тудушки но можешь их добавлять то норм? и с удалением наверное так же
// для чего мне  user = useContext<User | null> и что мне с ним делать или он просто для локал стореджа и мне его не трогать
// disable на инпут во время поиска ответа от сервера не могу поставить
// как мне сделать Clear completed если для этого нужен статус комплит тру а он по дефолту фолз а модификация тудушек то 3я часть задания
// сделать все тудушки комплит тру и тестить а потом на фолз вернуть
// и рубрика тайпскрипт
// делаем активные тудушки у них и клеар у себя

// 3я задача чтобы найти что чистим через фильтр делаем

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
import { AuthContext } from './components/Auth/AuthContext';

import { getTodos, postTodo, removeTodo } from './api/todos';

import { Todo } from './types/Todo';
import { User } from './types/User';

import { SortTypes } from './types/SortTypes';

import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<string>(SortTypes.All);
  // iscloseError
  const [closeError, setCloseError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  // если поставть 0 вместо null то ошибки нет но сразу без нажатия на кнопку срабатывает поиск по пути todo/null и это ошибка
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  const [loader, setLoader] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // костыль для ошибки при удалении тудушки
  // const [count, setCount] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  // console.log(newTodoField);
  // console.log(user);
  // console.log(todos);
  // console.log(selectedTodoId);

  if (closeError) {
    // console.log('work');
    setTimeout(() => {
      setCloseError(false);
    }, 3000);
  }

  const removeError = (boolean: boolean) => {
    setCloseError(boolean);
  };

  // просто поставил свою записть из локал стореджа и запись не удаляется при обновлении страницы
  // много перерендеров теперь это норм?
  // и получаю ошибку что юз колбек внутри колбека вызывать нельзя
  useEffect(() => {
    // эта штука переписывает мою ошибку в делит
    // setErrorMessage('Unable to load a todo');
    getTodos(user?.id || 0).then(response => {
      setTodos(response);
      // catch всегда принимает объект с ошибкой я ее тут просто игнорю
      // но в catch я тут пеердал пустой колбек
      // setErrorMessage(null);
    }).catch(() => {
      // если вызываю это тут то оно дергано выплывает
      setErrorMessage('Unable to load a todo');
      // не могу нал поставить так как из за масива сзависимостями будет вечный перерендер
      // setErrorMessage(null);
      setCloseError(true);
    });
    // вызывает кучу перерендеров
    // setErrorMessage(null);
  }, [errorMessage]);

  const handleSortType = (type: string) => {
    setSortType(type);
  };

  const filteredTodos = todos.filter(todo => {
    switch (sortType) {
      case SortTypes.All:
        return todo;

      case SortTypes.Active:
        return !todo.completed && SortTypes.Active;

      case SortTypes.Completed:
        return todo.completed && SortTypes.Completed;

      default:
        return null;
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // если ввожу пробелы то оно не добавляет так как ретерн
    // если после пробелов пишу что-то то добавляет без пробелов
    if (!title.trim()) {
      setErrorMessage("Title can't be empty");
      setTitle('');
      setCloseError(true);

      return;
    }

    // setLoader(0);
    setIsAdding(true);

    // стрелку функцию
    // setTodos([...todos, {
    //   id: 0,
    //   userId: user?.id || 0,
    //   completed: false,
    //   title,
    // }]);

    // const test = [...todos];

    setTodos(prev => {
      return [...prev, {
        id: 0,
        userId: user?.id || 0,
        completed: false,
        title,
      }];
    });

    setLoader(0);

    // при обработке ошибки сообщение работает нормально но и лоудер сначало грузится и показываетсмя что он есть и потом исчезает
    postTodo(user?.id || 0, title)
      .then(newTodo => {
        // console.log(newTodo);
        setIsAdding(false);

        // setLoader(newTodo.id);
        // добавляю новую тудушку в массив с тудушками по 0 айди что создал выше
        // и лоадер может не пригодится
        setLoader(null);
        setTodos((prev) => {
          return prev.map(todo => {
            if (todo.id === 0) {
              return newTodo;
            }

            return todo;
          });
        });

        // setTodos([...test, newTodo]);
      })
      .catch(() => {
        setCloseError(true);
        // setTodos([...test]);
        setErrorMessage('Unable to add a todo');

        // filter id del
        // setTodos(() =>)
        // setTodos((prev) => {
        //   return prev.filter(a => a.id !== 0);
        // });
      });
    // но походу сабмит формы выполняется быстрее?
    // setLoader(0);
    // console.log(loader);
    setTitle('');
  };

  // const deleteTodo = (todoId: number) => {
  //   setSelectedTodoId(todoId);
  // };

  // тут не должен быть юз ефект а на кнопке удалить это все и тогда оно сразу срвбвтывать не будет
  // и мне не selectedTodoId нужен а по нажатию Todo.id из замыкания
  // useEffect(() => {
  //   removeTodo(selectedTodoId)
  //     .then(() => {
  //       // setdelLoadTest(true);
  //       // setdelLoadTest(false);
  //       setErrorMessage(null);
  //       setTodos(prevTodos => prevTodos
  //         .filter(todo => todo.id !== selectedTodoId));
  //     })
  //     .catch(() => {
  //       // if (count === 0) {
  //       //   // console.log('object');
  //       //   setCount((prev) => prev + 1);
  //       // } else if (count > 0) {
  //       //   setCloseError(true);
  //       // }

  //       setCloseError(true);
  //       // console.log(1);
  //       // console.log(count);
  //       // console.log(test);

  //       // console.log(closeError);
  //       // setCloseError(true);
  //       setErrorMessage('Unable to delete a todo');
  //     });
  //   // setTodos(removeTodo(selectedTodoId));
  //   // setTodos(todos);
  //   // сюда тудушки передавать ненадо
  //   // если поставить зависимость ошибку то будет ее генерить всегда
  //   // setErrorMessage(null);
  // }, [selectedTodoId]);

  // при посте тудушки лоудер отсутствует
  const deleteTodo2 = (todoId: number) => {
    // setErrorMessage('Unable to delete a todo');
    // скорее всего это из за условия в туду лист так как переменной с айди больше нет а в условии она есть но ничего не принимает
    // console.log(todoId);
    // да это нужно для условия чтобы удаление работало
    setSelectedTodoId(todoId);
    removeTodo(todoId)
      .then(() => {
        setErrorMessage(null);
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setCloseError(true);
        setErrorMessage('Unable to delete a todo');
      });
    setErrorMessage(null);
  };
  // console.log(todos);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="make all todos active or vice versa"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          { /* событие для того чобы после отправки формы а именно ентера что то появлялось */ }
          {/* но проблема что оно после перезагрузки не остается а исчезает */}
          {/* просто поставил свою записть из локал стореджа и запись не удаляется при обновлении страницы */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              // тут просто делаю инпут контролируемым
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              // disabled={setDisabled}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodos}
          // deleteTodo={deleteTodo}
          deleteTodo2={deleteTodo2}
          selectedTodoId={selectedTodoId}
          loader={loader}
        />
        <Footer
          todos={todos}
          handleSortType={handleSortType}
          sortType={sortType}
        />

      </div>

      <ErrorNotification
        closeError={closeError}
        removeError={removeError}
        errorMessage={errorMessage}
        // title={title}
        // titleError={titleError}
        // setTitleError={setTitleError}
      />
      {/* <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */}
    </div>
  );
};
