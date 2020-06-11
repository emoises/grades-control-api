const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

const saveStudents = async (student) =>
    await fs.writeFile(global.grades, JSON.stringify(student)).catch( (error) => {
        console.log(error)
    });
const getGrades = async () => {
    try {
        const dataGrades = await fs.readFile(global.grades,'utf8')
        return dataGrades
    } catch (error) {
        let blankGrade = {
            nextId: 1,
            grades: []
        }
        saveStudents(blankGrade)
        logger.info('Sua grade está vazia')
    }
}

    router.get('/', async (req, res) => {
        const  data = await getGrades()
        const allGrades = JSON.parse(data)
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
            res.json(value)
            logger.info(`A soma das grades é: ${value}`)
            
        } catch (error) {
            res.json('Não foi possível completar sua solicitação. Por favor verifique os dados.')
            logger.info(
              'Não foi possível completar sua solicitação. Por favor verifique os dados.'
            );
        }
    });
    router.get('/media', async (req, res) => {
        const  data = await getGrades()
        const allGrades = JSON.parse(data)
        const { subject, type } = req.body
        const typeExist = allGrades.grades.findIndex(grade => grade.type === type)
        const subjectExist = allGrades.grades.findIndex(grade => grade.subject === subject)
        try {
            if ((typeExist < 0) || (subjectExist < 0)) { throw error }
            let arrayLength = 0
            const value = allGrades.grades
                .filter(grade => grade.subject === subject)
                .filter(grade => grade.type === type)
                .reduce((acc, cur, idx, src) => {
                    arrayLength = src.length
                    return (acc + cur.value)
                }, 0)
            res.json(value / arrayLength)
            logger.info(`A soma das grades é: ${value}`)
            
        } catch (error) {
            res.json('Não foi possível completar sua solicitação. Por favor verifique os dados.')
            logger.info(
              'Não foi possível completar sua solicitação. Por favor verifique os dados.'
            );
        }
    });
    router.get('/ranking', async (req, res) => {
        const { subject, type } = req.body
        try {
            const data = await getGrades();
            const allGrades = JSON.parse(data);
            const typeExist = allGrades.grades.findIndex(grade => grade.type === type)
            const subjectExist = allGrades.grades.findIndex(grade => grade.subject === subject)
            if ((typeExist < 0) || (subjectExist < 0)) { throw error }
            const rank = allGrades.grades
            .filter(grade => grade.subject === subject)
            .filter(grade => grade.type === type)
            .sort((a, b) => b.value - a.value)
            // .filter((_,index) => index < 3);
            res.json(rank);
            logger.info( `melhores: ${JSON.stringify(rank)}` );
        } catch (error) {
            res.json('Não foi possível completar sua solicitação. Por favor verifique os dados.');
            logger.error(error);
        }
    });
    router.get('/:id', async (req, res) => {
        const id = Number(req.params.id);
        try {
            const data = await getGrades()
            const students = JSON.parse(data);
            const idExist = students.grades.findIndex(student => student.id === id);
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