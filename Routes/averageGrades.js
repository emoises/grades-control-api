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
const saveStudents = (student) =>
    fs.writeFileSync(global.grades, JSON.stringify(student, null, '\t'));



module.exports = router;