class PaymentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PaymentError';
    }
}

class PaymentCreationError extends PaymentError {
    constructor(message) {
        super(message);
        this.name = 'PaymentCreationError';
    }
}

class PaymentValidationError extends PaymentError {
    constructor(message) {
        super(message);
        this.name = 'PaymentValidationError';
    }
}

class PaymentWebhookError extends PaymentError {
    constructor(message) {
        super(message);
        this.name = 'PaymentWebhookError';
    }
}

class PaymentRetryError extends PaymentError {
    constructor(message) {
        super(message);
        this.name = 'PaymentRetryError';
    }
}

module.exports = {
    PaymentError,
    PaymentCreationError,
    PaymentValidationError,
    PaymentWebhookError,
    PaymentRetryError
}; 