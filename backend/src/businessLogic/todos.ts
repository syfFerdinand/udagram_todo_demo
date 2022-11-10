import { TodoAccess } from '../dataLayer/todosAcess'
import {  getUploadUrl } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const todoAccess = new TodoAccess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
}
  
export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
  ): Promise<TodoItem> {
  
    const itemId = uuid.v4()
  
    return await todoAccess.createTodo({
      userId: userId,
      todoId: itemId,
      name: createTodoRequest.name,
      done: false,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    })
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    userId: string,
    todoId: string
  ){
  
    
  await todoAccess.updateTodo(
    updateTodoRequest.name,
    updateTodoRequest.dueDate,
    updateTodoRequest.done,
    todoId,
    userId
  )
}

export async function deleteTodo(
    todoId: string,
    userId: string
  ){
  
    await todoAccess.deleteTodo(
      todoId,
      userId)
}

export function generateUploadUrl(
  todoId: string): string{
    
  return getUploadUrl(todoId)
}
