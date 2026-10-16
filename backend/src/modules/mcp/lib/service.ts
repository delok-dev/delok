import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/AppError.js";
import { dateRangeSchema } from "./validation.js";

export {
  listOrganizations,
  listProjects,
  resolveProject,
} from "./core-repository.js";
export type {
  OrganizationRow,
  ProjectRow,
} from "./core-repository.js";

export interface LogSummary {
  projectId: string;
  total: number;
  levelCounts: Record<string, number>;
  minMax: { minOccurredAt: Date; maxOccurredAt: Date } | null;
}

export interface LogRow {
  id: string;
  projectId: string;
  level: string;
  event: string;
  message: string | null;
  environment: string;
  occurredAt: Date;
  receivedAt: Date;
}

const LOG_SELECT = {
  id: true,
  projectId: true,
  level: true,
  event: true,
  message: true,
  environment: true,
  occurredAt: true,
  receivedAt: true,
} as const;

/**
 * Build the Prisma `where` clause shared by the summary and search tools.
 * Date-range validation lives here (service layer); callers only coerce.
 */
const buildLogWhere = (filter: {
  projectId: string;
  from?: Date;
  to?: Date;
  level?: string;
  environment?: string;
  search?: string;
}): Record<string, unknown> => {
  const range = dateRangeSchema.parse({ from: filter.from, to: filter.to });
  if (range.from && range.to && range.to < range.from) {
    throw new AppError("time range is backwards", 400, "validation.range_backwards");
  }

  const where: Record<string, unknown> = { projectId: filter.projectId };

  if (range.from || range.to) {
    const occurredAt: Record<string, Date> = {};
    if (range.from) occurredAt.gte = range.from;
    // `to` is inclusive of the whole calendar day.
    if (range.to) occurredAt.lt = new Date(range.to.getTime() + 86400000);
    where.occurredAt = occurredAt;
  }

  if (filter.level) where.level = filter.level;
  if (filter.environment) where.environment = filter.environment;

  if (filter.search) {
    where.OR = [
      { event: { contains: filter.search, mode: "insensitive" } },
      { message: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  return where;
};

/**
 * Get aggregate log counts for a project and time range.
 */
export const getLogSummary = async (
  projectId: string,
  filter: { from?: Date; to?: Date; level?: string; environment?: string },
): Promise<LogSummary> => {
  const where = buildLogWhere({ projectId, ...filter });

  const [total, byLevel, minMax] = await Promise.all([
    prisma.logEvent.count({ where }),
    prisma.logEvent.groupBy({
      where,
      by: ["level"],
      _count: true,
      orderBy: { level: "asc" },
    }),
    prisma.logEvent.aggregate({
      where,
      _min: { occurredAt: true },
      _max: { occurredAt: true },
    }),
  ]);

  const levelCounts: Record<string, number> = {};
  for (const row of byLevel) {
    levelCounts[row.level] = row._count;
  }

  return {
    projectId,
    total,
    levelCounts,
    minMax:
      minMax._min.occurredAt && minMax._max.occurredAt
        ? {
            minOccurredAt: minMax._min.occurredAt,
            maxOccurredAt: minMax._max.occurredAt,
          }
        : null,
  };
};

/**
 * Search logs for a project, bounded and paginated.
 */
export const searchLogs = async (
  projectId: string,
  filter: { from?: Date; to?: Date; level?: string; environment?: string; search?: string },
  options: { page?: number; limit?: number },
): Promise<{
  projectId: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  logs: LogRow[];
}> => {
  const pageNum = Math.max(options.page ?? 1, 1);
  const limitNum = Math.min(Math.max(options.limit ?? 50, 1), 250);

  const where = buildLogWhere({ projectId, ...filter });

  const skip = (pageNum - 1) * limitNum;
  const [total, logs] = await Promise.all([
    prisma.logEvent.count({ where }),
    prisma.logEvent.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      skip,
      take: limitNum,
      select: LOG_SELECT,
    }),
  ]);

  return {
    projectId,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / Math.max(limitNum, 1)),
    logs,
  };
};

/**
 * Get a single log event for a project, with a bounded representation.
 */
export const getLogDetail = async (
  projectId: string,
  logId: string,
): Promise<LogRow | null> =>
  prisma.logEvent.findUnique({
    where: { id: logId, projectId },
    select: LOG_SELECT,
  });