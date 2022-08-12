import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('game_rounds')
@Index(['brand', 'gameCode', 'playerId', 'platformId', 'operatorId'])
export class GameRound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  gameCode: string;

  @Column()
  playerId: string;

  @Column()
  platformId: string;

  @Column()
  operatorId: string;

  @Column({ nullable: true })
  aggregatorId: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ unique: true })
  roundId: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  status: number;

  @Column({ type: 'decimal' })
  betAmount: number;

  @Column({ type: 'decimal' })
  winAmount: number;

  @Column({ type: 'decimal' })
  jpWinAmount: number;

  @Column({ type: 'decimal' })
  refundAmount: number;

  @Column()
  currencyCode: string;

  @Column('jsonb', { nullable: true })
  transactions: ITransaction[];

  @Column({ nullable: true })
  region: string;

  @Column('jsonb', { nullable: true })
  otherParams: any;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}

export interface ITransaction {
  rgsTransactionId: string;
  platformTransactionId: string;
  amount: number;
  transactionType: string;
  requestTime: Date;
  responseTime: Date;
  message: string;
}
