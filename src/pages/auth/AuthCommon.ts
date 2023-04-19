export function checkUsername(username: string): Array<string> {
  const errors: Array<string> = [];


  if (username.length < 5) {
    errors.push("Имя должно быть длиннее 4 символов!");
    return errors;
  } 
  
  if (username.length > 30) {
    errors.push("Имя должно быть не длиннее 30 символов!");
    return errors;
  }

  const firstSymbolRegexp: RegExp = new RegExp("^[A-Za-zА-ЯЁа-яё].+");

  if (!firstSymbolRegexp.test(username)) {
    errors.push("Имя должно начинаться с русской или латинской буквы!");
  }

  const allSymbolsRegexp: RegExp = new RegExp("^[-_ A-Za-zА-ЯЁа-яё0-9]+$");

  if (!allSymbolsRegexp.test(username)) {
    errors.push("Имя может содержать только русские и латинские буквы, цифры, пробелы и символы \"-\" и \"_\".");
  }

  const endSymbolRegexp: RegExp = new RegExp(".+[^ ]$");

  if (!endSymbolRegexp.test(username)) {
    errors.push("Имя не может оканчиваться на пробел!");
  }

  const specialSymbolsGoInRowRegexp: RegExp = new RegExp("^(?!.*[- _]{2,}).+$");

  if (!specialSymbolsGoInRowRegexp.test(username)) {
    errors.push("Символы \"-\", \"_\" и пробел не могут идти подряд!");
  }

  return errors;
}



export function checkPassword(password: string): Array<string> {
  const errors: Array<string> = [];


  if (password.length < 3) {
    errors.push("Пароль должен быть длиннее 7 символов!");
    return errors;
  } 
  
  if (password.length > 40) {
    errors.push("Пароль должен быть не длиннее 40 символов!");
    return errors;
  }

  const containsLatingLetterRegexp: RegExp = new RegExp("(?=.*[A-Za-z])");

  if (!containsLatingLetterRegexp.test(password)) {
    errors.push("Пароль должен содержать хотя бы одну ланитскую букву!");
  }

  const containsNumberRegexp: RegExp = new RegExp("(?=.*[0-9])");

  if (!containsNumberRegexp.test(password)) {
    errors.push("Пароль должен содержать хотя бы одно число!");
  }

  const allSymbolsRegexp: RegExp = new RegExp("^[-+_!?=@#$%^&*A-Za-z0-9]+$");

  if (!allSymbolsRegexp.test(password)) {
    errors.push("Пароль может содержать только латинские буквы, цирфы и символы -+_!?=@#$%^&*");
  }

  return errors;
}