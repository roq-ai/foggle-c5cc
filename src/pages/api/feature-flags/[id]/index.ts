import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { featureFlagValidationSchema } from 'validationSchema/feature-flags';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.feature_flag
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFeatureFlagById();
    case 'PUT':
      return updateFeatureFlagById();
    case 'DELETE':
      return deleteFeatureFlagById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFeatureFlagById() {
    const data = await prisma.feature_flag.findFirst(convertQueryToPrismaUtil(req.query, 'feature_flag'));
    return res.status(200).json(data);
  }

  async function updateFeatureFlagById() {
    await featureFlagValidationSchema.validate(req.body);
    const data = await prisma.feature_flag.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteFeatureFlagById() {
    const data = await prisma.feature_flag.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
