import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";

@Index("types_name_key", ["name"], { unique: true })
@Index("types_pkey", ["typesid"], { unique: true })
@Entity("types", { schema: "public" })
export class Types {
  @PrimaryGeneratedColumn({ type: "integer", name: "typesid" })
  typesid: number;

  @Column("character varying", { name: "name", unique: true, length: 50 })
  name: string;

  @OneToMany(() => Books, (books) => books.types)
  books: Books[];
}
