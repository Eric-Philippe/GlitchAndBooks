import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";

@Index("authors_pkey", ["authorid"], { unique: true })
@Entity("authors", { schema: "public" })
export class Authors {
  @PrimaryGeneratedColumn({ type: "integer", name: "authorid" })
  authorid: number;

  @Column("character varying", {
    name: "firstname",
    nullable: true,
    length: 155,
  })
  firstname: string | null;

  @Column("character varying", { name: "lastname", length: 155 })
  lastname: string;

  @ManyToMany(() => Books, (books) => books.authors)
  @JoinTable({
    name: "written_by",
    joinColumns: [{ name: "authorid", referencedColumnName: "authorid" }],
    inverseJoinColumns: [{ name: "bookid", referencedColumnName: "bookid" }],
    schema: "public",
  })
  books: Books[];
}
