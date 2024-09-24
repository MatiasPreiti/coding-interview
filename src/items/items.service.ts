import { PrismaClient } from '@prisma/client';
import { CreateUpdateItemDTO, ItemResponseDTO } from './dto/items.dto';
import { InternalServerError } from '../utils/errors.class';

export class ItemService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(payload: CreateUpdateItemDTO): Promise<ItemResponseDTO> {
    try {
      const newItem = await this.prisma.item.create({
        data: {
          ...payload,
        },
      });
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw new InternalServerError('Failed to create item');
    }
  }

  public async getById(id: number): Promise<ItemResponseDTO | null> {
    try {
      const item = await this.prisma.item.findUnique({
        where: { id },
      });
      return item;
    } catch (error) {
      console.error(`Error getting item with id ${id}:`, error);
      throw new InternalServerError('Failed to retrieve item');
    }
  }

  public async getAll(): Promise<ItemResponseDTO[]> {
    try {
      return await this.prisma.item.findMany();
    } catch (error) {
      console.error('Error getting all items:', error);
      throw new InternalServerError('Failed to retrieve items');
    }
  }

  public async update(
    payload: CreateUpdateItemDTO,
    id: number
  ): Promise<ItemResponseDTO> {
    try {
      const updatedItem = await this.prisma.item.update({
        where: { id },
        data: { ...payload },
      });
      return updatedItem;
    } catch (error) {
      console.error(`Error updating item with id ${id}:`, error);
      throw new InternalServerError('Failed to update item');
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.prisma.item.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting item with id ${id}:`, error);
      throw new InternalServerError('Failed to delete item');
    }
  }
}
