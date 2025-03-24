import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInitialTables1710433000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla de usuarios
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        // Crear tabla de todos
        await queryRunner.createTable(new Table({
            name: "todo",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "title",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "completed",
                    type: "boolean",
                    default: false
                },
                {
                    name: "user_id",
                    type: "int"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        // Crear foreign key
        await queryRunner.createForeignKey("todo", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("todo");
        await queryRunner.dropTable("user");
    }
} 