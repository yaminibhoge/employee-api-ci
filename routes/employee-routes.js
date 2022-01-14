const {Router} = require('express');
const {EmployeeService } = require('../helpers/employee-helper-v3');

var router = Router();
var empServ = new EmployeeService();
//Get all employee
// GET /employees
router.get("/",async(req, res)=>{
    let emps = await empServ.getAllEmployees().catch(err=>res.status(500).json({'message':'Unable to read the employees'}));

    if(emps){
        res.status(200).json(emps);
    }
})

//Add an employee
// Post /employees
router.post("/", async(req, res)=>{
    let empItem = req.body;
    var result = await empServ.addEmployee(empItem).catch(err=>{console.log(err); res.status(500).json({'message':'Unable to add the employees'})});
    if(result){
        res.status(201).json({'message':'Employee added successfully'});
    }
})

//Get employees from a location
//GET /employees/location/:locId

router.get("/location/:locId", async(req, res)=>{
    let locationId = req.params["locId"];
    let result = await empServ.getEmployeesByLocation(locationId).catch(err=>{console.log(err); res.status(500).json({'message':'Unable to fetch employees details'})});
    if(result)
    {
        res.status(200).json(result.Items);
    }
})

//Get employee 
//GET /employees/location/:locId/empCode/:empCode

router.get("/location/:locId/empCode/:empCode", async(req, res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["empCode"];
    let result = await empServ.getEmployee(locationId, empCode).catch(err=>{console.log(err); res.status(500).json({'message':'Unable to fetch employee details'})});
    if(result)
    {
        res.status(200).json(result);
    }
})

// Delete employee
//DELETE /employees/location/:locId/empCode/:empCode
router.delete("/location/:locId/empCode/:empCode", async(req, res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["empCode"];
    let result = await empServ.deleteEmployee(locationId, empCode).catch(err=>{console.log(err); res.status(500).json({'message':'Unable to delete employee details'})});
    if(result)
    {
        res.status(201).json({'message':'Employee deleted successfully'});
    }
})

//UPdate employee
//PUT /employees/location/:locId/empCode/:empCode
router.put("/", async(req, res)=>{
    let employee = req.body;
    console.log(employee);
    let result = await empServ.updateEmployee(employee).catch(err=>{console.log(err); res.status(500).json({'message':'Unable to update employee details'})});
    if(result)
    {
        res.status(200).json(result.Item);
    }
})

//module.exports = {router};
module.exports = router;