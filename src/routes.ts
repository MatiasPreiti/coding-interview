import { Server } from '@hapi/hapi';
import itemRoutes from './items/items.routes';

export const defineRoutes = async (server: Server) => {
  server.route({
    method: 'GET',
    path: '/ping',
    handler: async () => {
      return {
        ok: true,
      };
    },
  });

  await server.register(itemRoutes);
};
