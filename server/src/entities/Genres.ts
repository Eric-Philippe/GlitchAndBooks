import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";

@Index("genres_pkey", ["genresid"], { unique: true })
@Index("genres_name_key", ["name"], { unique: true })
@Entity("genres", { schema: "public" })
export class Genres {
  @PrimaryGeneratedColumn({ type: "integer", name: "genresid" })
  genresid: number;

  @Column("character varying", { name: "name", unique: true, length: 50 })
  name: string;

  @ManyToMany(() => Books, (books) => books.genres)
  books: Books[];
}
