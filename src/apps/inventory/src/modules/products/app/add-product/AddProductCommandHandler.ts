import { AddProductCommand } from './AddProductCommand';


export type AddProductCommandHandler = CommandHandler<AddProductCommand, {id: string;}>;


export const addProductCommandHandler = () => {

}