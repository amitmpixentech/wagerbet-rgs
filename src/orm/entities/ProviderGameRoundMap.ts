import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('provider_game_round_map')
export class ProviderGameRoundMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rgsRoundID: string;

  @Column()
  gameRoundId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
