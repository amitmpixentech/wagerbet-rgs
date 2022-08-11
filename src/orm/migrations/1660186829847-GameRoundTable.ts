import { MigrationInterface, QueryRunner } from "typeorm";

export class GameRoundTable1660186829847 implements MigrationInterface {
    name = 'GameRoundTable1660186829847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "game_rounds" (
                "id" SERIAL NOT NULL,
                "brand" character varying NOT NULL,
                "game_code" character varying NOT NULL,
                "player_id" character varying NOT NULL,
                "platform_id" character varying NOT NULL,
                "operator_id" character varying NOT NULL,
                "aggregator_id" character varying,
                "provider_id" character varying,
                "round_id" character varying NOT NULL,
                "start_date" TIMESTAMP NOT NULL,
                "end_date" TIMESTAMP NOT NULL,
                "status" integer NOT NULL,
                "bet_amount" numeric NOT NULL,
                "win_amount" numeric NOT NULL,
                "jp_win_amount" numeric NOT NULL,
                "currency_code" character varying NOT NULL,
                "transactions" jsonb,
                "region" character varying,
                "other_params" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_745a14437d641e4bca39decd0c4" UNIQUE ("round_id"),
                CONSTRAINT "PK_9f9de91990bb512595f1058b98c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b1c2104face8fef9b133eed74f" ON "game_rounds" (
                "brand",
                "game_code",
                "player_id",
                "platform_id",
                "operator_id"
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "provider_game_round_map" (
                "id" SERIAL NOT NULL,
                "rgs_round_id" character varying NOT NULL,
                "game_round_id" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_14e588c99580ce928de6266f764" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "provider_game_round_map"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b1c2104face8fef9b133eed74f"
        `);
        await queryRunner.query(`
            DROP TABLE "game_rounds"
        `);
    }

}
