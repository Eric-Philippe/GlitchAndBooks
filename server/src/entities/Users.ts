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

  @Column("character varying", { name: "password", length: 55 })
  password: string;

  @OneToMany(() => Books, (books) => books.user)
  books: Books[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];
}
