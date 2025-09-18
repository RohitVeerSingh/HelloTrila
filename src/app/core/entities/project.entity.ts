import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm/browser';


@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;


    @Column()
    title!: string;


    @Column('text')
    description!: string;


    @Column({ type: 'text', nullable: true })
    createdAt?: any; // ISO string


    
}