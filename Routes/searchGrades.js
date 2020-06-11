const express = require('express');
const router = express.Router();
const fs = require('fs');

function getGrades() {
    const dataGrades = fs.existsSync(global.grades)
        ? fs.readFileSync(global.grades)
        : []
    try {
        return dataGrades
    } catch (error) {
        console.log(error)
    }
}

    router.get('/', (req, res) => {
        const allGrades = JSON.parse(getGrades());
        const { subject, student } = req.body
        const typeExist = allGrades.grades.findIndex(grade => grade.student === student)
        const subjectExist = allGrades.grades.findIndex(grade => grade.subject === subject)
        try {
            if ((typeExist < 0) || (subjectExist < 0)) { throw error }
            let arrayLength = 0
            const value = allGrades.grades
                .filter(grade => grade.subject === subject)
                .filter(grade => grade.student === student)
                .reduce((acc, cur, idx, src) => {
                    arrayLength = src.length
                    return (acc + cur.value)
                }, 0)
            res.json(`Total da nota: ${value}`)
            logger.info(`o soma da é: ${value}`)
            
        } catch (error) {
            res.json('Não foi possível completar sua solicitação. Por favor verifique os dados.')
            logger.info(
              'Não foi possível completar sua solicitação. Por favor verifique os dados.'
            );
        }
    });
    router.get('/ranking', (req, res) => {
        const allGrades = JSON.parse(getGrades());
        const { subject, type } = req.body
        const typeExist = allGrades.grades.findIndex(grade => grade.type === type)
        const subjectExist = allGrades.grades.findIndex(grade => grade.subject === subject)
        
        try {
            if ((typeExist < 0) || (subjectExist < 0)) { throw error }
            let arrayLength = 0
            const rank = allGrades.grades
            .filter(grade => grade.subject === subject)
            .filter(grade => grade.type === type)
            .sort((a, b) => b.value - a.value)
            .filter((_,index) => index < 3);
            res.json(rank);
            logger.info( `melhores: ${JSON.stringify(rank)}` );
        } catch (error) {
            res.json('Não foi possível completar sua solicitação. Por favor verifique os dados.');
            loggger.error(error);
        }
    });
    router.get('/:id', (req, res) => {
        const students = JSON.parse(getGrades());
        const id = Number(req.params.id);
        const idExist = students.grades.findIndex(student => student.id === id);
        try {
            if (idExist < 0) { throw error }
            const findStudent = students.grades.filter(student => student.id === id);
            res.json(findStudent);
            logger.info(`id - ${id}: ${JSON.stringify(findStudent)}`);
        } catch (error) {
            res.status(400).json(`Não foi possível encontrar o usuário ${id}`)
            logger.error(error);
        }
    
    })
    
    module.exports = router;