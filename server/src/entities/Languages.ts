import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";

@Index("languages_pkey", ["languagesid"], { unique: true })
@Index("languages_langue_key", ["langue"], { unique: true })
@Entity("languages", { schema: "public" })
export class Languages {
  @PrimaryGeneratedColumn({ type: "integer", name: "languagesid" })
  languagesid: number;

  @Column("character varying", { name: "langue", unique: true, length: 20 })
  langue: string;

  @OneToMany(() => Books, (books) => books.languages)
  books: Books[];
}
