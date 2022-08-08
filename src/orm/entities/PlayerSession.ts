import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('player_sessions')
export class PlayerSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerId: string;

  @Column()
  token: string;

  @Column()
  brand: string;

  @Column()
  playerName: string;

  @Column()
  currencyCode: string;

  @Column()
  platformId: string;

  @Column()
  operatorId: string;

  @Column()
  aggregatorId: string;

  @Column()
  providerId: string;

  @Column()
  region: string;

  @Column({ type: 'decimal' })
  balance: number;

  @Column()
  status: string;

  @Column('jsonb', { nullable: true })
  otherParams: any;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
