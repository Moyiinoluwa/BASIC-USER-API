const constant = require('../Constants');
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constant.VALIDATION:
            res.json({
                title: 'Validation error',
                message: error.message,
                stackTrace: error.stackTrace
            })
            break;
            
            case constant.UNAUTHORIZED:
            res.json({
                title: 'User unauthorized',
                message: error.message,
                stackTrace: error.stackTrace
            })
            break;

            case constant.FOBIDDEN:
            res.json({
                title: 'User forbidden',
                message: error.message,
                stackTrace: error.stackTrace
            })
            break;

            case constant.NOT_FOUND:
            res.json({
                title: 'Not found',
                message: error.message,
                stackTrace: error.stackTrace
            })
            break;

            case constant.SERVER_ERROR:
            res.json({
                title: 'Server error',
                message: error.message,
                stackTrace: error.stackTrace
            })
            break;
        default:
            {
                console.log('There is no error')
            }
            break;
    }
}


module.exports = errorHandler;