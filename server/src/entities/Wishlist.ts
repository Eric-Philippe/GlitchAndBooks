import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("wishlist_pkey", ["wishlistid"], { unique: true })
@Entity("wishlist", { schema: "public" })
export class Wishlist {
  @PrimaryGeneratedColumn({ type: "integer", name: "wishlistid" })
  wishlistid: number;

  @Column("character varying", { name: "title", length: 50 })
  title: string;

  @Column("character varying", { name: "author", length: 155 })
  author: string;

  @Column("integer", { name: "price", nullable: true })
  price: number | null;

  @Column("character varying", { name: "image", length: 255, nullable: true })
  editor: string | null;

  @ManyToOne(() => Users, (users) => users.wishlists)
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: Users;
}
