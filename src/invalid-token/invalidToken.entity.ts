import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InvalidToken {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date: Date;
}