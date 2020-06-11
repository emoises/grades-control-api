const express = require('express');
const fs = require('fs');
const { join } = require('path');
const winston = require('winston');
const port = 3333;
const grades = require('./Routes/getGrades');
const search = require('./Routes/searchGrades');
// const average = require('./Routes/averageGrades')
// const parmsGrades = require('./Routes/paramsGrades')

const { combine, timestamp, label, printf } = winston.format
global.grades = join(__dirname,'grades.json')
const myFormat = printf(({level, message, label, timestamp})=> {
    return `${timestamp} [${label}] ${level}: ${message}`
})
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'grades-control-api.log'}),
  ],
  format: combine(
      label({label: "grades-control-api"}),
      timestamp(),
      myFormat
  )
});

const app = express();

app.use(express.json());

app.use('/grades', grades)
app.use('/search', search)
// app.use('/media', average)
// app.use('/parmsGrades', parmsGrades)

app.listen( port, () => {
    
    logger.info(`API rodando na porta ${port}`);
} )
