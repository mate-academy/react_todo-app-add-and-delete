// с лоудерами все ок
// блок then то не 3 сек в которых я могу что то делать
// то блок в котором я могу что то делать с запросом что уже пришел
// для кнопки чистки надо использовать промис ол и делать стейт с отфильтроваными айди что комплит
// и через инклуд в условии с лоудером искать а для поста и удаления просто постовить к массиву [0]

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
  // const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  // const [loader, setLoader] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // костыль для ошибки при удалении тудушки
  // const [count, setCount] = useState(0);

  // мне походу стейт ненужен
  // возможно он нужен для сохранения сюда отсортированого по віполнению тудушек?
  // const [clearCompleted, setClearCompleted] = useState<number | null>(null);

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

  const removeError = (boolean: boolean) => {
    setCloseError(boolean);
  };

  // просто поставил свою записть из локал стореджа и запись не удаляется при обновлении страницы
  // много перерендеров теперь это норм?
  // и получаю ошибку что юз колбек внутри колбека вызывать нельзя
  useEffect(() => {
    // if (newTodoField.current) {
    //   newTodoField.current.focus();
    // }

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
      // не могу нал поставить так как из за масива с зависимостями будет вечный перерендер
      // setErrorMessage(null);
      setCloseError(true);
    });
    // вызывает кучу перерендеров
    // setErrorMessage(null);
  }, [errorMessage]);

  const deleteTodo2 = (todoId: number) => {
    // setErrorMessage('Unable to delete a todo');
    // скорее всего это из за условия в туду лист так как переменной с айди больше нет а в условии она есть но ничего не принимает
    // console.log(todoId);
    // да это нужно для условия чтобы удаление работало
    // из за того что он врубается раньше всего у меня появляется лоудер когда его быть не должно
    // но без него лоудер где надо не включится
    setSelectedTodoId(todoId);
    // setSelectedTodoId(0);
    removeTodo(todoId)
      .then(() => {
        // странно но параметр в then дает число 1
        // console.log(dd);
        setSelectedTodoId(todoId);
        // setSelectedTodoId((prev) => prev + todoId);
        // setSelectedTodoId(null);
        // почему то setSelectedTodoId null даже если todoId имеет число
        // оно применяется на 2й клик
        // но если я ставлю сет в начале то падают доругие куски кода
        // console.log(selectedTodoId, todoId);
        setErrorMessage(null);
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        // setSelectedTodoId(null);
        setCloseError(true);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setSelectedTodoId(null);
        // console.log(selectedTodoId);
      });
    // тут наглухо отключает
    // setErrorMessage(null);
    // setSelectedTodoId(null);
  };
  // console.log(todos);

  const handleSortType = (type: string) => {
    setSortType(type);
  };

  // console.log(user?.id);
  // console.log(selectedTodoId);
  // console.log(newTodoField.current);
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

    // if (newTodoField.current) {
    //   newTodoField.current.focus();
    // }

    // console.dir(newTodoField);
    // юз ефект в сабмите не катит поэтому не могу конкретизировать зависимости именно при создании тудушек
    // useEffect(() => {

    // })

    setIsAdding(true);

    const test = [...todos];
    // console.log(test);
    // console.log(user?.id);

    setTodos(prev => {
      return [...prev, {
        id: 0,
        userId: user?.id || 0,
        completed: false,
        title,
      }];
    });

    // console.log(todos);
    // єто работает
    setSelectedTodoId(0);
    // setSelectedTodoId(null);
    // console.log(selectedTodoId);
    // при обработке ошибки сообщение работает нормально но и лоудер сначало грузится и показываетсмя что он есть и потом исчезает
    postTodo(user?.id || 0, title)
      .then(newTodo => {
        // if (newTodoField.current) {
        //   newTodoField.current.focus();
        // }
        // console.log(newTodo);
        setIsAdding(false);
        // перенес это сюда и ошибка стала нормально работать
        // но обычный лоудер без ошибок перестал крутится
        // setTodos(prev => {
        //   return [...prev, {
        //     id: 0,
        //     userId: user?.id || 0,
        //     completed: false,
        //     title,
        //   }];
        // });
        // добавляю новую тудушку в массив с тудушками по 0 айди что создал выше
        // null тут работает
        // setSelectedTodoId(null);
        // setSelectedTodoId(null);
        // setSelectedTodoId(newTodo.id);
        // setTodos((prev) => {
        //   return prev.map(todo => {
        //     if (todo.id === 0) {
        //       return newTodo;
        //     }

        //     return todo;
        //   });
        // });
        // console.log([...test, newTodo]);
        // console.log(selectedTodoId);
        // в  комбинации с test и новой тудушки снаружи postTodo работает
        // я ставлю в 0  setSelectedTodoId и поэтому лоудер работает
        setTodos([...test, newTodo]);
        // console.log(todos);
      })
      .catch(() => {
        // console.log(selectedTodoId);
        setCloseError(true);
        setIsAdding(false);
        // setTodos([...test]);
        setErrorMessage('Unable to add a todo');

        // filter id del
        // setTodos(() =>)
        setTodos((prev) => {
          return prev.filter(oneTodo => {
            // условие верное но все равно тудушка появляется а потом исчезает
            // console.log(oneTodo.id !== 0);
            // console.log(oneTodo);

            return oneTodo.id !== 0;
          });
        });

        // setSelectedTodoId(null);
      })
      .finally(() => {
        // if (newTodoField.current) {
        //   newTodoField.current.focus();
        // }
      });
    // но походу сабмит формы выполняется быстрее?
    setSelectedTodoId(0);
    // setSelectedTodoId(null);
    // setCloseError(false);
    setTitle('');
  };

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

  const clearTable = () => {
    // console.log('object');

    // const removeCompleted = todos.filter(todo => {
    //   return todo.completed;
    // });

    // // console.log(removeCompleted);

    // // const arr;
    // // мне стоит новый стейт сделать?
    // const arr: [number] = [];
    // // const arr: [] = [];

    // const removeById = removeCompleted.forEach(todo => {
    //   // console.log(todo.id);
    //   arr.push(todo.id);
    //   // return [todo.id];
    // });

    // removeCompleted.forEach(todo => (todo.id));

    // console.log(removeById, arr);
    // const removeCompleted2 = todos.map(todo => {
    //   // кидает масив с булевыми значениями
    //   return todo.completed;
    // });

    // arr.forEach(id => {
    //   // только на 1м элементе лоудер
    //   setSelectedTodoId(id);
    //   removeTodo(id)
    //     .then(() => {
    //       // setSelectedTodoId(id);
    //       // console.log(selectedTodoId);
    //       setTodos(prevTodos => prevTodos
    //         .filter(todo => todo.id !== id));
    //     });
    // });

    // console.log(removeCompleted2);
    // console.log(removeCompleted.id);

    // почему пишет что пустота если я получаю числа?
    // removeTodo(removeCompleted.forEach(todo => todo.id))
    // попытался собрать все айдишники в массив и по одному через спред кинуть в удаление но не сработало
    // removeTodo([...arr])

    // removeTodo(arr.forEach(todo => todo))
    //   .then(() => {
    //     // setSelectedTodoId(todoId);

    //     // setErrorMessage(null);
    //     // setTodos(prevTodos => prevTodos
    //     //   .filter(todo => todo.id !== todoId));
    //   });
    // .catch(() => {
    //   // setSelectedTodoId(null);
    //   setCloseError(true);
    //   setErrorMessage('Unable to delete a todo');
    // })
    // .finally(() => {
    //   // setSelectedTodoId(null);
    //   // console.log(selectedTodoId);
    // });
  };

  // это часть по умолчанию
  // добавил массив с зависимостями нужно обяснение что произошло
  // из за отслеживания изменений в тудушках то при добавлении срабатывает фокус повторно?
  // теперь при удалении мне фокус не нужен
  // мне внутри сабмита нужно его обернуть в юз колбек и туда зависимостей кинуть?
  // но юз колбек сам по себе не может быть внутри колбека
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

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
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodos}
          // deleteTodo={deleteTodo}
          deleteTodo2={deleteTodo2}
          selectedTodoId={selectedTodoId}
          // loader={loader}
        />
        <Footer
          clearTable={clearTable}
          handleSortType={handleSortType}
          sortType={sortType}
          filteredTodos={filteredTodos}
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
