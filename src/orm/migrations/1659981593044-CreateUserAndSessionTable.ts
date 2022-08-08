import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndSessionTable1659981593044 implements MigrationInterface {
    name = 'CreateUserAndSessionTable1659981593044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "player_sessions" (
                "id" SERIAL NOT NULL,
                "playerId" character varying NOT NULL,
                "token" character varying NOT NULL,
                "brand" character varying NOT NULL,
                "playerName" character varying NOT NULL,
                "currencyCode" character varying NOT NULL,
                "platformId" character varying NOT NULL,
                "operatorId" character varying NOT NULL,
                "aggregatorId" character varying NOT NULL,
                "providerId" character varying NOT NULL,
                "region" character varying NOT NULL,
                "balance" numeric NOT NULL,
                "status" character varying NOT NULL,
                "otherParams" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3ef876b3c1f95a057a08256dfbf" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "playerId" character varying NOT NULL,
                "userName" character varying NOT NULL,
                "balance" numeric NOT NULL,
                "currencyCode" character varying NOT NULL,
                "languageCode" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_de726c21ef5fcb288216b5d869f" UNIQUE ("playerId"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "player_sessions"
        `);
    }

}
