import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";
import { Wishlist } from "./Wishlist";

@Index("users_pkey", ["userid"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "userid" })
  userid: number;

  @Column("character varying", { name: "username", length: 55 })
  username: string;

  @Column("character varying", { name: "password", length: 60 })
  password: string;

  @Column("character varying", { name: "email", length: 55 })
  email: string;

  @Column("bytea", { name: "avatar", nullable: true })
  avatar: Buffer;

  @OneToMany(() => Books, (books) => books.user)
  books: Books[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];
}
