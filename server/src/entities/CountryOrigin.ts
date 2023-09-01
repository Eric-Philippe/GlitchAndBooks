import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";

@Index("country_origin_country_key", ["country"], { unique: true })
@Index("country_origin_pkey", ["countryoriginid"], { unique: true })
@Entity("country_origin", { schema: "public" })
export class CountryOrigin {
  @PrimaryGeneratedColumn({ type: "integer", name: "countryoriginid" })
  countryoriginid: number;

  @Column("character varying", { name: "country", unique: true, length: 50 })
  country: string;

  @Column("character varying", { name: "code", unique: true, length: 50 })
  code: string;

  @OneToMany(() => Books, (books) => books.countryorigin)
  books: Books[];
}
