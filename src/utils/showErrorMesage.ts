export function showErrorMesage(
  errorText: string,
  errorFunction: (el: string) => void,
): void {
  errorFunction(errorText);
  setTimeout(() => errorFunction(''), 3000);
}
