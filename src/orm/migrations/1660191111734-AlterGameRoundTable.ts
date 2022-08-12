import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterGameRoundTable1660191111734 implements MigrationInterface {
    name = 'AlterGameRoundTable1660191111734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game_rounds"
            ADD "refund_amount" numeric NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "game_rounds"
            ALTER COLUMN "end_date" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game_rounds"
            ALTER COLUMN "end_date"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "game_rounds" DROP COLUMN "refund_amount"
        `);
    }

}
