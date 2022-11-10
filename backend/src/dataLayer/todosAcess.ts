import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient =new XAWS.DynamoDB.DocumentClient(),
    private readonly TodoItemsTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all TodoItems')
    const indexName = process.env.TODOS_CREATED_AT_INDEX;
    const result = await this.docClient.query({
      TableName: this.TodoItemsTable,
      IndexName: indexName,
      KeyConditionExpression: 'userId = :paritionKey',
      ExpressionAttributeValues: {
        ':paritionKey': userId
      }
    }).promise()
    console.log('data : '+result.Items);
    
    return result.Items as TodoItem[]
  }

  async createTodo(TodoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.TodoItemsTable,
      Item: TodoItem
    }).promise()

    console.log('data : '+TodoItem);
    return TodoItem
  }

  async updateTodo(
    name: string,
    dueDate: string,
    done: boolean,
    todoId:string, 
    userId:string){
    try {
        await this.docClient.update({
            TableName: this.TodoItemsTable,
            Key:{
              "todoId":todoId,
              "userId":userId,
            },
            UpdateExpression: "set #name = :n, #dueDate = :du, #done = :do",
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            },
            ExpressionAttributeValues:{
              ":n":name,
              ":du":dueDate,
              ":do":done
            }
          }).promise()
      console.log('all is good')
    } catch (error) {
        console.log('Error :',error)
    }
  }

  async deleteTodo(todoId: string,userId: string){

    try {
        const key = {
          userId: userId,
          todoId: todoId,
        }  
    
        await this.docClient.delete({
          TableName: this.TodoItemsTable,
          Key: key
        }).promise()

        console.log('all is good !')
    } catch (error) {
        console.log('Error :',error)
    }
  }


}


// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     console.log('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()
// }
