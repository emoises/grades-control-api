const express = require('express');
const router = express.Router();
const fs =require('fs').promises;
const winston = require('winston')


const saveStudents = async (student) =>
    await fs.writeFile(global.grades, JSON.stringify(student)).catch((error) => {
        console.log(error)
    });
const getGrades = async () => {
    try {
        const dataGrades = await fs.readFile(global.grades, 'utf8')
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

router.post('/', async (req,res)=> {
    try {
        let body = req.body
        const data = await getGrades()
        const students = JSON.parse(data)
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
router.get('/', async (_,res) => {
    try {
        const data = await getGrades();
        const students = JSON.parse(data);
        nextId = students.nextId;
        delete students.nextId;
        res.json(students);
        logger.info(`grades: ${JSON.stringify(students)}`);
        students.nextId = nextId;
    } catch (error) {
        res.status(400).json(error)
        logger.error(error)
    }

})
''
router.put('/', async (req, res) => {
    try {
        const body = req.body;
        const data = await getGrades();
        const students = JSON.parse(data);
        const index = students.grades.findIndex(
            (grade) => body.id === grade.id
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

router.delete('/:id',async  (req,res) => {
    const data = await getGrades();
    const students = JSON.parse(data);
    const id = Number(req.params.id)
    nextId = students.nextId;
    const idExist = students.grades.findIndex( student => student.id === id )
    try {
        if(idExist < 0 ){throw error}
        const deletedStudents = students.grades.filter(student => student.id !== id)
        students. grades= deletedStudents   
        saveStudents(students)
        res.json(`Grade ${id} excluída com sucesso`)
        logger.info(`Grade ${id} excluída com sucesso`);
        
    } catch (error) {
        res.status(400).json(`Não foi possível encontrar o usuário ${id}`)
        logger.error(error)
    }
})

module.exports = router;