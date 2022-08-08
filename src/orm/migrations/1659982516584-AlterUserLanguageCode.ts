import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserLanguageCode1659982516584 implements MigrationInterface {
    name = 'AlterUserLanguageCode1659982516584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "languageCode" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "languageCode"
            SET NOT NULL
        `);
    }

}
