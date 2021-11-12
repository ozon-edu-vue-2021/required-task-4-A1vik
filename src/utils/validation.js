const ERRORS = {
  FIRST_NAME_ERROR: 'FIRST_NAME_ERROR',
  LAST_NAME_ERROR: 'LAST_NAME_ERROR',
  FIRST_NAME_PREV_ERROR: 'FIRST_NAME_PREV_ERROR',
  LAST_NAME_PREV_ERROR: 'LAST_NAME_PREV_ERROR',
  MIDDLE_NAME_ERROR: 'MIDDLE_NAME_ERROR',
  BIRTHDAY_ERROR: 'BIRTHDAY_ERROR',
  EMAIL_ERROR: 'EMAIL_ERROR',
  FIRST_NAME_ERROR_ENG: 'FIRST_NAME_ERROR_ENG',
  LAST_NAME_ERROR_ENG: 'LAST_NAME_ERROR_ENG',
  PASSPORT_NUMBER: 'PASSPORT_NUMBER',
  SERIAL_NUMBER: 'SERIAL_NUMBER',
}

const VALIDATION_TYPE = {
  REQUIRED: 'REQUIRED',
  MAX_LENGTH: 'MAX_LENGTH',
  NOT_INTEGER: 'NOT_INTEGER',
  NOT_EMAIL: 'NOT_EMAIL',
  RUS_SYMBOLS: 'RUS_SYMBOLS',
  ENG_SYMBOLS: 'ENG_SYMBOLS',
  NOT_TODAY: 'NOT_TODAY',
};

const ERRORS_TEXT = {
  [VALIDATION_TYPE.REQUIRED]: 'Поле обязательно для заполнения',
  [VALIDATION_TYPE.RUS_SYMBOLS]: 'Можно ввести только русские символы',
  [VALIDATION_TYPE.ENG_SYMBOLS]: 'Можно ввести только английские символы',
  [VALIDATION_TYPE.NOT_INTEGER]: 'Можно ввести только цифры',
  [VALIDATION_TYPE.MAX_LENGTH]: 'Недопустимое количество символов',
  [VALIDATION_TYPE.NOT_TODAY]: 'Некорректная дата рождения',
  [VALIDATION_TYPE.NOT_EMAIL]: 'Некорректная почта',
};

const ERROR_KEY ={
  NAME: 'name',
  TYPE: 'type',
};

const createError = (name, type) => ({
  [ERROR_KEY.NAME]: name,
  [ERROR_KEY.TYPE]: type,
});

const handleError = (invalid, errors, error) => {
  let index = errors.findIndex(err =>
    err[ERROR_KEY.NAME] === error[ERROR_KEY.NAME] &&
    err[ERROR_KEY.TYPE] === error[ERROR_KEY.TYPE]);
  let notFound = index === -1;
  let found = !notFound;
  if (invalid) {
    if (notFound) {
      errors.unshift(error);
    }
  } else {
    if (found) {
      errors.splice(index, 1);
    }
  }
};

const integerRegExp = /^$|^[+-]?\d+$/;
const validateInteger = (value) => {
  integerRegExp.lastIndex = 0;
  return integerRegExp.test(value);
};

const emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const validateEmail = (value) => {
  emailRegExp.lastIndex = 0;
  return emailRegExp.test(value)
}

const rusRegExp = /^[а-яё\s]+$/gi;
const validateRusSymbols = (value) => {
  rusRegExp.lastIndex = 0;
  return rusRegExp.test(value);
}

const engRegExp = /[a-z\s]+/gi;
const validateEngSymbols = (value) => {
  engRegExp.lastIndex = 0;
  return engRegExp.test(value);
}

export {VALIDATION_TYPE, ERROR_KEY, ERRORS, ERRORS_TEXT, createError, handleError, validateInteger, validateEmail, validateRusSymbols, validateEngSymbols}