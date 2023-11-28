import { MigrationInterface, QueryRunner } from "typeorm"
import * as bcrypt from 'bcrypt';
import { ActiveType, UserType } from "src/user/entities/user.entity";

export class CreateSuperAdminAccount1701136898105 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('12345678', salt);

        const superAdminTable = await queryRunner.query(`
            INSERT INTO "users" (email, password, user_type, is_active)
            VALUES ('superadmin@email.com', '${hashedPassword}', '3', '1') RETURNING id;
        `);

        await queryRunner.query(`
            INSERT INTO "admins" (first_name, last_name, gender, contact_number, "userId")
            VALUES ('Super', 'Admin', 'Male', '09558369140', ${superAdminTable[0].id});
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM "admins"
        WHERE first_name = 'Super' AND last_name = 'Admin';
    `); 

        await queryRunner.query(`
            DELETE FROM "users"
            WHERE email = 'superadmin@email.com';
        `);

    }

}
