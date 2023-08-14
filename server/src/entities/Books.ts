import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CountryOrigin } from "./CountryOrigin";
import { Languages } from "./Languages";
import { Types } from "./Types";
import { Users } from "./Users";
import { Genres } from "./Genres";
import { Authors } from "./Authors";

@Index("books_pkey", ["bookid"], { unique: true })
@Entity("books", { schema: "public" })
export class Books {
  @PrimaryGeneratedColumn({ type: "integer", name: "bookid" })
  bookid: number;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("smallint", { name: "page_number", nullable: true })
  pageNumber: number | null;

  @Column("integer", { name: "height", nullable: true })
  height: number | null;

  @Column("integer", { name: "width", nullable: true })
  width: number | null;

  @Column("boolean", { name: "read" })
  read: boolean;

  @Column("date", { name: "publication_date", nullable: true })
  publicationDate: Date | null;

  @Column("boolean", { name: "want_to_read" })
  wantToRead: boolean;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("boolean", { name: "physical" })
  physical: boolean;

  @ManyToOne(() => CountryOrigin, (countryOrigin) => countryOrigin.books)
  @JoinColumn([
    { name: "countryoriginid", referencedColumnName: "countryoriginid" },
  ])
  countryorigin: CountryOrigin;

  @ManyToOne(() => Languages, (languages) => languages.books)
  @JoinColumn([{ name: "languagesid", referencedColumnName: "languagesid" }])
  languages: Languages;

  @ManyToOne(() => Types, (types) => types.books)
  @JoinColumn([{ name: "typesid", referencedColumnName: "typesid" }])
  types: Types;

  @ManyToOne(() => Users, (users) => users.books)
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: Users;

  @ManyToMany(() => Genres, (genres) => genres.books)
  @JoinTable({
    name: "has_genres",
    joinColumns: [{ name: "bookid", referencedColumnName: "bookid" }],
    inverseJoinColumns: [
      { name: "genresid", referencedColumnName: "genresid" },
    ],
    schema: "public",
  })
  genres: Genres[];

  @ManyToMany(() => Authors, (authors) => authors.books)
  authors: Authors[];
}
