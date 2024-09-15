import { Express } from 'express';

export const listRoutes = (app: Express): void => {
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          console.log(`${handler.route.stack[0].method.toUpperCase()} ${handler.route.path}`);
        }
      });
    }
  });
};
