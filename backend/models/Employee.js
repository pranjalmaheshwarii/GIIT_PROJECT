const pool = require("../db/conn");

module.exports = class Employee {
  constructor({ emp_name, emp_contact, emp_add }) {
    this.emp_name = emp_name;
    this.emp_contact = emp_contact;
    this.emp_add = emp_add;
  }

  create(result) {
    pool.query("INSERT INTO EMPLOYEES SET ?", this)
      .then(([res]) => {
        console.log("created Employee: ", { id: res.insertId, ...this });
        result(null, { id: res.insertId, ...this });
      })
      .catch(err => {
        console.log("error: ", err);
        result(err, null);
      });
  }

  static findAll(result) {
    pool.query("SELECT * FROM EMPLOYEES")
      .then(([rows]) => {
        console.log("Employees: ", rows);
        result(null, rows);
      })
      .catch(err => {
        console.log("error: ", err);
        result(null, err);
      });
  }

  static deleteOne(empId, result) {
    pool.query("DELETE FROM EMPLOYEES WHERE emp_id = ?", [empId])
      .then(([res]) => {
        console.log("employee deleted");
        result(null, { data: res });
      })
      .catch(err => {
        console.log("error: ", err);
        result(err, null);
      });
  }
};

