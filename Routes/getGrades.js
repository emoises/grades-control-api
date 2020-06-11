const express = require('express');
const router = express.Router();
const fs =require('fs');
const winston = require('winston')


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
const saveStudents = (student) =>
    fs.writeFileSync(global.grades, JSON.stringify(student, null, '\t'));

router.post('/', (req,res)=> {
    try {
        let body = req.body
        const students = JSON.parse(getGrades());
        body = { id: students.nextId, ...body};
        students.grades.push(body);
        students.nextId++
        saveStudents(students);
        res.json(students);
        logger.info(`Grade criada com sucesso: ${JSON.stringify(body)}`);
    } catch (error) {
        res.status(400).json(error);
        logger.error(error);
    }
})
router.get('/',(_,res) => {
    try {
        const students = JSON.parse(getGrades());
        nextId = students.nextId;
        delete students.nextId;
        res.json(students);
        logger.info(`grades: ${students}`)
        students.nextId = nextId;
    } catch (error) {
        res.status(400).json(error)
        logger.error(error)
    }

})

router.put('/', (req, res) => {
    try {
          const body = req.body;
          const students = JSON.parse(getGrades());
          const index = students.grades.findIndex(
            (student) => body.id === student.id
          );
          if (!index) {
            throw err;
          }
          const studentToChange = Object.keys(body).forEach((element) => {
            if (body[element] !== '') {
              students.grades[index][element] = body[element];
            }
          });
          saveStudents(students);
          let changedGrade = students.grades[index];
          res.json(students.grades[index]);
          logger.info(`Grade alterada com sucesso: ${JSON.stringify(changedGrade)}`);
        } catch (err) {
        res.status(400).json(`Não foi possível identificar o usuário. \ error: ${err.message}`);
        logger.error(error)
    }

})

router.delete('/:id', (req,res) => {
    const students = JSON.parse(getGrades());
    const id = Number(req.params.id)
    nextId = students.nextId;
    const idExist = students.grades.findIndex( student => student.id === id )
    try {
        if(idExist < 0 ){throw error}
        const deletedStudents = students.grades.filter(student => student.id !== id)
        students. grades= deletedStudents   
        saveStudents(students)
        // res.json(students)
        res.json(`Grade ${id} excluída com sucesso`)
        logger.info(`Grade ${id} excluída com sucesso`);
        
    } catch (error) {
        res.status(400).json(`Não foi possível encontrar o usuário ${id}`)
        logger.error(error)
    }
})

module.exports = router;