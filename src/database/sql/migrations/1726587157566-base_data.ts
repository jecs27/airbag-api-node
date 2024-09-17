import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseData1726587157566 implements MigrationInterface {
    name = 'BaseData1726587157566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicles" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "licensePlate" character varying NOT NULL, "vin" character varying NOT NULL, "make" character varying NOT NULL, "vehicleType" character varying NOT NULL, "userUuid" uuid NOT NULL, CONSTRAINT "UQ_79a273823977d25c7523162cd5a" UNIQUE ("licensePlate"), CONSTRAINT "UQ_8288ce015b69c5856cf54e07a67" UNIQUE ("vin"), CONSTRAINT "PK_44081a0503cec549614d57eba9a" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_76436b13dbfd32ebe1233787ec2" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_76436b13dbfd32ebe1233787ec2"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
    }

}
