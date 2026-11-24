import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_deploys_status" ADD VALUE 'request';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "deploys" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "deploys" ALTER COLUMN "status" SET DEFAULT 'queued'::text;
  DROP TYPE "public"."enum_deploys_status";
  CREATE TYPE "public"."enum_deploys_status" AS ENUM('queued', 'triggered', 'live', 'unconfirmed', 'failed', 'superseded');
  ALTER TABLE "deploys" ALTER COLUMN "status" SET DEFAULT 'queued'::"public"."enum_deploys_status";
  ALTER TABLE "deploys" ALTER COLUMN "status" SET DATA TYPE "public"."enum_deploys_status" USING "status"::"public"."enum_deploys_status";`)
}
