# express-nemo-logger

A middleware for express, extending requests with a logger instance of your choice

## Options

| Name          | Required | Default value | Description                                                                        |
| ------------- | -------- | ------------- | ---------------------------------------------------------------------------------- |
| loggerFactory | Yes      | null          | A function receiving the request and response object, returning a logger instance. |
