import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class UserCredential {

  @OneToOne(() => User, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    referencedColumnName: 'id',
  })
  @Index()
  public user: User;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

  @Column('varchar')
  public password: string;

  @Column('varchar')
  public salt: string;

}
