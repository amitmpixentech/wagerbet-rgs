import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  playerId: string;

  @Column()
  userName: string;

  @Column({ type: 'decimal' })
  balance: number;

  @Column()
  currencyCode: string;

  @Column({ nullable: true })
  languageCode: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
