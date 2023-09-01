import React from "react";
import Card from "react-bootstrap/Card";

import { Book } from "../../models/Book";
// @ts-ignore
import { ResponsiveWaffle } from "@nivo/waffle";

const dateScale: number[] = [
  1400, 1700, 1900, 1925, 1950, 1975, 2000, 2010, 2050,
];

const buildData = (
  books: Book[]
): { id: string; label: string; value: number }[] => {
  const data = [];
  for (let i = 0; i < dateScale.length - 1; i++) {
    const previousYear = dateScale[i];
    const currentYear = dateScale[i + 1];

    data.push({
      id: `${currentYear}`,
      label: `${previousYear} - ${currentYear === 2050 ? "now" : currentYear}`,
      value: books.filter(
        (book) =>
          book.publicationYear &&
          book.publicationYear >= previousYear &&
          book.publicationYear < currentYear
      ).length,
    });
  }

  return data;
};

interface BooksPubliYearProps {
  books: Book[];
}

const BooksPublicYear: React.FC<BooksPubliYearProps> = ({ books }) => {
  const data = buildData(books);

  const totalBooks = data.reduce((acc, curr) => acc + curr.value, 0);
  const totalRows = Math.ceil(Math.sqrt(totalBooks)); // You can adjust this formula as needed
  const totalColumns = Math.ceil(Math.sqrt(totalBooks)); // You can adjust this formula as needed

  return (
    <>
      <Card
        className="d-inline-block sub-stat"
        style={{
          width: "100%",
        }}
      >
        <Card.Header>
          <h4>📅 Publication year breakdown </h4>
        </Card.Header>
        <div style={{ height: "240px" }}>
          <ResponsiveWaffle
            data={data}
            total={books.length}
            rows={totalRows}
            columns={totalColumns}
            padding={1}
            valueFormat=".2f"
            margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
            colors={{ scheme: "paired" }}
            borderRadius={3}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.3]],
            }}
            motionStagger={2}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                justify: false,
                translateX: -100,
                translateY: 0,
                itemsSpacing: 4,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 1,
                itemTextColor: "#FFF7",
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                      itemBackground: "#f7fafb",
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        <Card.Footer>
          <i>Number of books published in each year bracket</i>
        </Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BooksPublicYear;
