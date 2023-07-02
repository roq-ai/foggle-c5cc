import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { projectValidationSchema } from 'validationSchema/projects';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProjects();
    case 'POST':
      return createProject();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProjects() {
    const data = await prisma.project
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'project'));
    return res.status(200).json(data);
  }

  async function createProject() {
    await projectValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.environment?.length > 0) {
      const create_environment = body.environment;
      body.environment = {
        create: create_environment,
      };
    } else {
      delete body.environment;
    }
    if (body?.feature_flag?.length > 0) {
      const create_feature_flag = body.feature_flag;
      body.feature_flag = {
        create: create_feature_flag,
      };
    } else {
      delete body.feature_flag;
    }
    const data = await prisma.project.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
