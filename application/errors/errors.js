

var error = {

    USER_NOT_FOUND:             new Error('ERROR_USER_NOT_FOUND'),
    IDENTIFICATOR_IS_ABSENT:    new Error('IDENTIFICATOR_IS_ABSENT'),
    PASSWORD_IS_ABSENT:         new Error('PASSWORD_IS_ABSENT'),
    PASSWORD_IS_INCORRECT:      new Error('PASSWORD_IS_INCORRECT')

};

module.exports = error;