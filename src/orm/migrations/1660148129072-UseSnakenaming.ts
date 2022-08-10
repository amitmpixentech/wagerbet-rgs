import { MigrationInterface, QueryRunner } from "typeorm";

export class UseSnakenaming1660148129072 implements MigrationInterface {
    name = 'UseSnakenaming1660148129072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "playerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "playerName"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "currencyCode"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "platformId"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "operatorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "aggregatorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "otherParams"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_de726c21ef5fcb288216b5d869f"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "playerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "userName"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "currencyCode"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "languageCode"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "player_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "player_name" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "currency_code" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "platform_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "operator_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "aggregator_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "provider_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "other_params" jsonb
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "player_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_2e0df0c61c7b5738acbc103d7b8" UNIQUE ("player_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "user_name" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "currency_code" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "language_code" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "language_code"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "currency_code"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "user_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_2e0df0c61c7b5738acbc103d7b8"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "player_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "other_params"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "provider_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "aggregator_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "operator_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "platform_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "currency_code"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "player_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions" DROP COLUMN "player_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "languageCode" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "currencyCode" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "userName" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "playerId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_de726c21ef5fcb288216b5d869f" UNIQUE ("playerId")
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "otherParams" jsonb
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "providerId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "aggregatorId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "operatorId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "platformId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "currencyCode" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "playerName" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "player_sessions"
            ADD "playerId" character varying NOT NULL
        `);
    }

}
