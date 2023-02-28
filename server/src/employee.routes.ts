import express = require("express");
import * as mongodb from "mongodb";
import { collections } from "./database";


////////////////////
export const employeeRouter = express.Router();
employeeRouter.use(express.json());
////////////////////
/**
 * @swagger
 *  components:
 *      schemas:
 *          Employee:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  position:
 *                      type: string
 *                  level:
 *                      type: string
 *                      
 */

/**
 * @swagger
 * /employees:
 *  get:
 *      summary: get All employee details
 *      description: Use to request all employees
 *      responses:
 *          '200':
 *              description: data of all employees retrived successfully.
 */

employeeRouter.get("/", async (_req, res) => {
    try {
        const employees = await collections.employees.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * /employees/{id}:
 *  get:
 *      summary: get employee details on one employee using id
 *      description: Use to get single employee details based on employee id example => 63f6fa23925a8e8f91cc0855
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: hexadecimal
 *      responses:
 *          '200':
 *              description: get single employee details Successfully
 */

employeeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const employee = await collections.employees.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
});


/**
 * @swagger
 * /employees:
 *  post:
 *      summary: post employee details
 *      description: Use to post single employee details (use level as anyone from this [mid,senior,junior])   
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Employee'
 *      responses:
 *          '201':
 *              description:  added employee details Successfully.
 */
 
employeeRouter.post("/", async (req, res) => {
    try {
        const employee = req.body;
        const result = await collections.employees.insertOne(employee);

        if (result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new employee.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});


/**
 * @swagger
 * /employees/{id}:
 *  put:
 *      summary: Update employee details
 *      description: Use to update single employee details (use level as anyone from this [mid,senior,junior])
 *      parameters:
 *          - in: path
 *            name: id 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Employee'
 *      responses:
 *          '200':
 *              description:  Updated employee details Successfully.
 */

employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.updateOne(query, { $set: employee });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});


/**
 * @swagger
 * /employees/{id}:
 *  delete:
 *      summary: delete employee details of one employee using id
 *      description: Use to delete single employee details based on employee id example => 63f6fa23925a8e8f91cc0855
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      responses:
 *          '202':
 *              description: Employee details are deleted for above employee.
 */

employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
