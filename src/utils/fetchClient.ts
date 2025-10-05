// /* eslint-disable @typescript-eslint/no-explicit-any */
// // Вимкнення правила ESLint, яке забороняє використання типу `any`.
// // Це робиться для того, щоб можна було передавати будь-які дані до функції `request`
// // без отримання помилок від TypeScript.
// const BASE_URL = 'https://mate.academy/students-api';
//
// // Оголошення константи `BASE_URL`, яка зберігає базовий URL-адресу
// // для всіх подальших запитів.
//
// // returns a promise resolved after a given delay
// // Коментар, який описує наступну функцію: вона повертає проміс,
// // який буде виконано через вказану затримку.
// function wait(delay: number) {
//   // Оголошення функції `wait`, яка приймає один аргумент `delay` (число)
//   // і повертає проміс.
//   return new Promise(resolve => {
//     // Створення нового промісу. `resolve` - це функція,
//     // яка викликається для успішного виконання промісу.
//     setTimeout(resolve, delay);
//     // Використання `setTimeout` для затримки виконання промісу.
//     // Проміс буде виконано через `delay` мілісекунд,
//     // коли буде викликана функція `resolve`.
//   });
// }
//
// // To have autocompletion and avoid mistypes
// // Коментар, який описує наступний блок коду:
// // він допомагає з автозавершенням та уникненням помилок при наборі.
// type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
//
// // Оголошення типу `RequestMethod`.
// // Це рядок, який може приймати лише одне з чотирьох значень:
// // 'GET', 'POST', 'PATCH', або 'DELETE'.
// // Це робиться для підвищення безпеки та зручності розробки,
// // оскільки IDE зможе підказувати можливі варіанти.
//
// function request<T>(
//   // Оголошення універсальної (generic) функції `request`,
//   // яка приймає три аргументи:
//   // - `url`: рядок, що представляє кінцеву точку API.
//   // - `method`: рядок з типом `RequestMethod` (значення за замовчуванням 'GET').
//   // - `data`: будь-які дані, які будуть відправлені в тілі запиту
//   //   (значення за замовчуванням `null`).
//   url: string,
//   method: RequestMethod = 'GET',
//   data: any = null,
// ): Promise<T> {
//   // Функція повертає проміс, який після успішного виконання
//   // поверне дані типу `T`.
//   const options: RequestInit = { method };
//
//   // Оголошення об'єкта `options` з типом `RequestInit`,
//   // який буде переданий до `fetch`.
//   // Спочатку встановлюється лише властивість `method`.
//
//   if (data) {
//     // Перевірка, чи були передані дані. Якщо `data` не `null`,
//     // то виконується наступний блок коду.
//     // We add body and Content-Type only for the requests with data
//     // Коментар, який пояснює, що `body` та `Content-Type` додаються
//     // лише для запитів, що містять дані.
//     options.body = JSON.stringify(data);
//     // Серіалізація об'єкта `data` в рядок JSON та призначення його
//     // властивості `body` в об'єкті `options`.
//     options.headers = {
//       // Оголошення заголовків запиту.
//       'Content-Type': 'application/json; charset=UTF-8',
//       // Встановлення заголовка `'Content-Type'`, який вказує серверу,
//       // що тіло запиту є JSON.
//     };
//   }
//
//   // DON'T change the delay it is required for tests
//   // Коментар, що вказує не змінювати затримку, оскільки це необхідно для тестів.
//   return wait(100)
//     // Виклик функції `wait` з затримкою 100 мс.
//     // Це створює штучну затримку перед виконанням запиту, що імітує
//     // реальний час відповіді від сервера.
//     .then(() => fetch(BASE_URL + url, options))
//     // Коли проміс `wait` виконано, викликається `fetch`.
//     // `BASE_URL` та `url` об'єднуються для отримання повного URL-адреси,
//     // а об'єкт `options` передається для налаштування запиту.
//     .then(response => {
//       // Обробка відповіді від `fetch`.
//       if (!response.ok) {
//         // Перевірка, чи була відповідь успішною.
//         // Властивість `response.ok` повертає `true` для успішних
//         // HTTP-статусів (наприклад, 200-299).
//         throw new Error();
//         // Якщо відповідь не є успішною, генерується нова помилка,
//         // яка перерве ланцюжок промісів.
//       }
//
//       return response.json();
//       // Якщо відповідь успішна, викликається метод `response.json()`
//       // для парсингу тіла відповіді як JSON.
//       // Цей метод також повертає проміс.
//     });
// }
//
// export const client = {
//   // Оголошення константи `client`, яка експортується з файлу
//   // і представляє об'єкт з функціями-допоміжниками.
//   get: <T>(url: string) => request<T>(url),
//   // Метод `get`, який приймає URL-адресу та викликає функцію `request`
//   // з методом `GET` за замовчуванням.
//   post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
//   // Метод `post`, який приймає URL-адресу та дані.
//   // Він викликає `request` з методом `POST` та переданими даними.
//   patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
//   // Метод `patch`, який працює аналогічно `post`,
//   // але використовує метод `PATCH` для оновлення ресурсів.
//   delete: (url: string) => request(url, 'DELETE'),
//   // Метод `delete`, який приймає URL-адресу та викликає `request`
//   // з методом `DELETE` для видалення ресурсів.
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null, // we can send any data to the server
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // DON'T change the delay it is required for tests
  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
