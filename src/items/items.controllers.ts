// src/controllers/item.controller.ts

import * as Hapi from '@hapi/hapi';
import { ItemService } from './items.service';
import { CreateUpdateItemDTO, ItemResponseDTO } from './dto/items.dto';
import { InternalServerError, NotFoundError } from '../utils/errors.class';

const itemService = new ItemService();

export class ItemController {
  async getAll(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<Hapi.ResponseObject> {
    try {
      const items: ItemResponseDTO[] = await itemService.getAll();
      return h.response(items).code(200);
    } catch (error) {
      return this.handleError(error, h);
    }
  }

  async create(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<Hapi.ResponseObject> {
    try {
      const { name, price } = request.payload as CreateUpdateItemDTO;

      if (price === undefined) {
        return h
          .response({
            errors: [{ field: 'price', message: 'Field "price" is required' }],
          })
          .code(400);
      }

      if (price < 0) {
        return h
          .response({
            errors: [
              { field: 'price', message: 'Field "price" cannot be negative' },
            ],
          })
          .code(400);
      }

      const newItem: ItemResponseDTO = await itemService.create({
        name,
        price,
      });
      return h.response(newItem).code(201);
    } catch (error) {
      return this.handleError(error, h);
    }
  }

  async getById(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<Hapi.ResponseObject> {
    try {
      const id = parseInt(request.params.id);
      const item = await itemService.getById(id);

      if (!item) {
        return h
          .response({ message: `Item with id ${id} not found` })
          .code(404);
      }

      return h.response(item).code(200);
    } catch (error) {
      return this.handleError(error, h);
    }
  }

  async update(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<Hapi.ResponseObject> {
    try {
      const id = parseInt(request.params.id);
      const { name, price } = request.payload as CreateUpdateItemDTO;

      if (price < 0) {
        return h
          .response({
            errors: [
              { field: 'price', message: 'Field "price" cannot be negative' },
            ],
          })
          .code(400);
      }

      const updatedItem: ItemResponseDTO = await itemService.update(
        { name, price },
        id
      );
      return h.response(updatedItem).code(200);
    } catch (error) {
      return this.handleError(error, h);
    }
  }

  async delete(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<Hapi.ResponseObject> {
    try {
      const id = parseInt(request.params.id);
      await itemService.delete(id);
      return h.response().code(204);
    } catch (error) {
      return this.handleError(error, h);
    }
  }

  private handleError(
    error: Error,
    h: Hapi.ResponseToolkit
  ): Hapi.ResponseObject {
    if (error instanceof NotFoundError) {
      return h.response({ message: error.message }).code(404);
    } else if (error instanceof InternalServerError) {
      return h.response({ message: error.message }).code(500);
    } else {
      console.error('Unexpected error:', error);
      return h.response({ message: 'Unexpected error occurred' }).code(500);
    }
  }
}
