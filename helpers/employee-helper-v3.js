const { ddbclient } = require('./ddbclient-v3');
const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

class EmployeeService{

    constructor(){
        this.TABLENAME = process.env.TABLENAME || "CustomAppEmployees";
    }

    async getAllEmployees(){
        let params = {
            TableName : this.TABLENAME,
            Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            //FilterExpression: 'Department = :dept',
            //ExpressionAttributeValues: {
            //    ':dept' : {S: 'IT'}
            //,}
            //ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            //ExpressionAttributeNames: {
            //"#Ename":"Name",
            //"#Loc":"Location" 
            //}   
        }
        
        //promise is default provided by PutItemCommand
        //return ddbclient.send(new ScanCommand(params));
        let result = await ddbclient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    addEmployee(employee){
        let params = {
            TableName : this.TABLENAME,
            Item : marshall(employee)
            /*Item : {
                LocationId : {S : employee.LocationId},
                EmployeeCode : {S : employee.EmpCode},
                Name : {S: employee.Name },
                Age : {N : employee.Age},
                Location : {S : employee.Location},
                Designation :{ S: employee.Designation},
                Department : {S : employee.Department}
            }*/
        };
        console.log(params);
        return ddbclient.send(new PutItemCommand(params));
    }

    getEmployeesByLocation(locationId){
        var params = {
            TableName: this.TABLENAME,
            Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            KeyConditionExpression: 'LocationId = :locId',
            ExpressionAttributeValues: {
             ':locId' : {S: locationId}
            }
        };
        return ddbclient.send(new QueryCommand(params));
    }

    async getEmployee(locationId, empCode){
        var params = {
            TableName: this.TABLENAME,
            Key :{
                "LocationId":{S : locationId},
                "EmployeeCode":{S:empCode}
            }
        };
        //return ddbclient.send(new GetItemCommand(params));
        
        let result = await ddbclient.send(new GetItemCommand(params)).catch(err => Promise.reject(err));
        return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)
    }

    deleteEmployee(locationId, empCode){
        var params = {
            TableName: this.TABLENAME,
            Key :{
                "LocationId":{S : locationId},
                "EmployeeCode":{S:empCode}
            }
        };
        return ddbclient.send(new DeleteItemCommand(params));
    }

    updateEmployee(employee){
        console.log(employee);
        var params = {
            TableName: this.TABLENAME,
            Key :{
                "LocationId":employee.LocationId,
                "EmployeeCode":employee.EmployeeCode
            },
            UpdateExpression: "set #Name = :name, Age = :age, #Location = :location, Department = :department, Designation = :designation ",
            ExpressionAttributeNames : {
                "#Name" : "Name",
                "#Location" : "Location"
            },
            ExpressionAttributeValues : {
                ":name" : { S : employee.Name },
                ":age" : { N : employee.Age },
                ":location" : { S : employee.Location },
                ":department" : { S : employee.Department },
                ":designation" : { S : employee.Designation }
            }
        };
        return ddbclient.send(new UpdateItemCommand(params));
    }
}
module.exports = {EmployeeService};