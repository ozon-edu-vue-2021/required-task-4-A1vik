<template>
  <div class="form">
    <form action="/" @submit.prevent="submitForm">
      <fieldset class="form-group">
        <legend>Личные данные</legend>
        <div class="row">
          <text-input
            type="text"
            id="lastname"
            label="Фамилия"
            v-model="formData.personal.lastName"
            :error="lastNameError"
          />
          <text-input
            type="text"
            id="firstName"
            label="Имя"
            v-model="formData.personal.firstName"
            :error="firstNameError"
          />
          <text-input
            type="text"
            id="middleName"
            label="Отчество"
            v-model="formData.personal.middleName"
            :error="middleNameError"
          />
        </div>
        <div class="row">
          <text-input
            type="date"
            id="birthday"
            label="Дата рождения"
            v-model="formData.personal.birthday"
            :error="birhdayError"
          />
        </div>
        <div class="row">
          <text-input
            type="email"
            id="email"
            label="E-mail"
            v-model="formData.personal.email"
            :error="emailError"
          />
        </div>
        <div class="radio-group">
          <p>Пол</p>
          <div>
            <input
              id="male"
              type="radio"
              value="male"
              v-model="formData.personal.gender"
            />
            <label for="male">Мужской</label>
            <input
              id="female"
              type="radio"
              value="female"
              v-model="formData.personal.gender"
            />
            <label for="female">Женский</label>
          </div>
        </div>
      </fieldset>
      <fieldset class="form-group">
        <legend>Паспортные данные</legend>
        <div class="row">
          <dropdown
            :items="citizenships"
            label="Гражданство"
            field="nationality"
            v-model="formData.passport.nationality"
          />
        </div>
        <div class="row" v-if="isRusNationality">
          <text-input
            type="text"
            id="series"
            label="Серия паспорта"
            v-model="formData.passport.rus.series"
            :error="passportSeriesError"
          />
          <text-input
            type="text"
            id="number"
            label="Номер паспорта"
            v-model="formData.passport.rus.number"
            :error="passportNumberError"
          />
          <text-input
            type="date"
            id="passportDate"
            label="Дата выдачи"
            v-model="formData.passport.rus.date"
          />
        </div>
        <div v-else-if="!isRusNationality">
          <div class="row">
            <text-input
              type="text"
              id="lastNameRest"
              label="Фамилия на латиннице"
              v-model="formData.passport.rest.lastName"
              :error="lastNameEngError"
            />
            <text-input
              type="text"
              id="firstNameRest"
              label="Имя на латиннице"
              v-model="formData.passport.rest.firstName"
              :error="firstNameEngError"
            />
          </div>
          <div class="row">
            <text-input
              type="text"
              id="passportNumberEng"
              label="Номер паспорта"
              v-model="formData.passport.rest.number"
            />
            <dropdown
              :items="citizenships"
              label="Страна выдачи"
              field="flag"
              v-model="formData.passport.rest.country"
            />
            <dropdown
              :items="passportTypes"
              label="Тип паспорта"
              field="type"
              v-model="formData.passport.rest.type"
            />
          </div>
        </div>
        <div class="radio-group">
          <p>Меняли ли фамилию или имя</p>
          <div>
            <input
              id="changeNo"
              type="radio"
              value="no"
              v-model="formData.changeName.isChange"
            />
            <label for="changeNo">Нет</label>
            <input
              id="changeYes"
              type="radio"
              value="yes"
              v-model="formData.changeName.isChange"
            />
            <label for="changeYes">Да</label>
          </div>
          <div class="row" v-if="isShowChangeNameBlock">
            <text-input
              type="text"
              id="prevLastName"
              label="Фамилия"
              v-model="formData.changeName.lastName"
              :error="lastNamePrevError"
            />
            <text-input
              type="text"
              id="prevFirstName"
              label="Имя"
              v-model="formData.changeName.firstName"
              :error="firstNamePrevError"
            />
          </div>
        </div>
      </fieldset>
      <button class="submit-button">Отправить</button>
    </form>
  </div>
</template>

<script>
import citizenships from '@/assets/data/citizenships.json';
import passportTypes from '@/assets/data/passport-types.json';
import TextInput from './TextInput.vue';
import { handleError, createError, ERRORS, VALIDATION_TYPE, ERROR_KEY, ERRORS_TEXT, validateRusSymbols, validateEmail, validateEngSymbols, validateInteger } from '../utils/validation.js';
import Dropdown from './Dropdown.vue';

export default {
  components: {
    TextInput,
    Dropdown,
  },
  data() {
    return {
      formData: {
        personal: {
          lastName: '',
          firstName: '',
          middleName: '',
          birthday: '',
          email: '',
          gender: '',
        },
        passport: {
          nationality: '',
          rus: {
            series: '',
            number: '',
            date: '',
          },
          rest: {
            firstName: '',
            lastName: '',
            number: '',
            country: '',
            type: '',
          },
        },
        changeName: {
          isChange: '',
          firstName: '',
          lastName: '',
        },
      },
      citizenships: citizenships,
      passportTypes: passportTypes,
      validationErrors: [],
    };
  },
  methods: {
    submitForm() {
      this.validationErrors = [];
      this.forceValidation();
      console.log(this.validationErrors);
      if (this.isFormValid) {
        console.log('formData', this.formData);
      }
    },
    forceValidation() {
      this.validateEmail(this.formData.personal.email);
      this.validateBirthday(this.formData.personal.birthday);

      if (this.isRusNationality) {
        this.validateTextRus(this.formData.personal.firstName, ERRORS.FIRST_NAME_ERROR);
        this.validateTextRus(this.formData.personal.lastName, ERRORS.LAST_NAME_ERROR);
        this.validateTextRus(this.formData.personal.middleName, ERRORS.MIDDLE_NAME_ERROR);
        this.validatePassportNumber(this.formData.passport.rus.number);
        this.validatePassportSeries(this.formData.passport.rus.series);
      }

      if (!this.isRusNationality) {
        this.validateTextEng(this.formData.passport.rest.firstName, ERRORS.FIRST_NAME_ERROR_ENG);
        this.validateTextEng(this.formData.passport.rest.lastName, ERRORS.LAST_NAME_ERROR_ENG);
      }

      if (this.isShowChangeNameBlock) {
        this.validateTextRus(this.formData.changeName.firstName, ERRORS.FIRST_NAME_PREV_ERROR);
        this.validateTextRus(this.formData.changeName.lastName, ERRORS.LAST_NAME_PREV_ERROR);
      }
    },
    validateTextRus(value, errorName) {
      handleError(
        !value,
        this.validationErrors,
        createError(errorName, VALIDATION_TYPE.REQUIRED)
      );
      handleError(
        !validateRusSymbols(value),
        this.validationErrors,
        createError(errorName, VALIDATION_TYPE.RUS_SYMBOLS)
      );
    },
    validateTextEng(value, errorName) {
      handleError(
        !value,
        this.validationErrors,
        createError(errorName, VALIDATION_TYPE.REQUIRED)
      );
      handleError(
        !validateEngSymbols(value),
        this.validationErrors,
        createError(errorName, VALIDATION_TYPE.ENG_SYMBOLS)
      );
    },
    validateEmail(value) {
      handleError(
        !value,
        this.validationErrors,
        createError(ERRORS.EMAIL_ERROR, VALIDATION_TYPE.REQUIRED)
      );
      handleError(
        !validateEmail(value),
        this.validationErrors,
        createError(ERRORS.EMAIL_ERROR, VALIDATION_TYPE.NOT_EMAIL)
      );
    },
    validatePassportNumber(value) {
      handleError(
        value.length !== 6,
        this.validationErrors,
        createError(ERRORS.PASSPORT_NUMBER, VALIDATION_TYPE.MAX_LENGTH)
      );
      handleError(
        !validateInteger(value),
        this.validationErrors,
        createError(ERRORS.PASSPORT_NUMBER, VALIDATION_TYPE.NOT_INTEGER)
      );
    },
    validatePassportSeries(value) {
      handleError(
        value.length !== 4,
        this.validationErrors,
        createError(ERRORS.SERIAL_NUMBER, VALIDATION_TYPE.MAX_LENGTH)
      );
      handleError(
        !validateInteger(value),
        this.validationErrors,
        createError(ERRORS.SERIAL_NUMBER, VALIDATION_TYPE.NOT_INTEGER)
      );
    },
    validateBirthday(value) {
      const date = new Date(value);
      const today = new Date();

      handleError(
        !(date < today),
        this.validationErrors,
        createError(ERRORS.BIRTHDAY_ERROR, VALIDATION_TYPE.NOT_TODAY)
      );
    },
    getFilteredErrors(errorName) {
      const errors = this.validationErrors.filter(error => error[ERROR_KEY.NAME] === errorName);
      if (errors.length) {
        return ERRORS_TEXT[errors[0][ERROR_KEY.TYPE]];
      }
      return '';
    }
  },
  computed: {
    isShowChangeNameBlock() {
      return this.formData.changeName.isChange === 'yes';
    },
    isRusNationality() {
      return this.formData.passport.nationality === 'Russia';
    },
    isFormValid() {
      return !this.validationErrors.length;
    },
    lastNameError() {
      return this.getFilteredErrors(ERRORS.LAST_NAME_ERROR);
    },
    firstNameError() {
      return this.getFilteredErrors(ERRORS.FIRST_NAME_ERROR);
    },
    middleNameError() {
      return this.getFilteredErrors(ERRORS.MIDDLE_NAME_ERROR);
    },
    firstNameEngError() {
      return this.getFilteredErrors(ERRORS.FIRST_NAME_ERROR_ENG);
    },
    lastNameEngError() {
      return this.getFilteredErrors(ERRORS.LAST_NAME_ERROR_ENG);
    },
    emailError() {
      return this.getFilteredErrors(ERRORS.EMAIL_ERROR);
    },
    passportNumberError() {
      return this.getFilteredErrors(ERRORS.PASSPORT_NUMBER);
    },
    passportSeriesError() {
      return this.getFilteredErrors(ERRORS.SERIAL_NUMBER);
    },
    birhdayError() {
      return this.getFilteredErrors(ERRORS.BIRTHDAY_ERROR);
    },
    lastNamePrevError() {
      return this.getFilteredErrors(ERRORS.LAST_NAME_PREV_ERROR);
    },
    firstNamePrevError() {
      return this.getFilteredErrors(ERRORS.FIRST_NAME_PREV_ERROR);
    },
  }
};
</script>

<style scoped>
.form {
  max-width: 1000px;
  margin: 0 auto;
}

.row {
  display: flex;
  max-width: 70%;
  margin-bottom: 20px;
}

.radio-group p {
  margin-bottom: 4px;
}

.radio-group label {
  margin-right: 7px;
}

.input {
  margin-right: 10px;
  display: flex;
  flex-direction: column;
}

.input label {
  margin-bottom: 5px;
}

.submit-button {
  margin: 30px auto;
}
</style>
