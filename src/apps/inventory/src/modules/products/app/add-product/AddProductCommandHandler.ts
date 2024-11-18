import { CommandHandler } from 'common-aws';

import { AddProductCommand } from './AddProductCommand';
import { ProductRepository } from '../../core/repository/ProductRepository';

export type AddProductCommandHandler = CommandHandler<AddProductCommand, {id: string;}>;

interface AddProductCommandHandlerDeps {
    productRepository: ProductRepository;
}

export const addProductCommandHandler = ({}: AddProductCommandHandlerDeps): AddProductCommandHandler => {
    const handleAsync = async (command: AddProductCommand) => {
        

        return {id}
    }

    return {
        handleAsync
    }
}