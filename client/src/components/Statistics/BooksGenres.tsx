import React from "react";
import Card from "react-bootstrap/Card";

import { Book } from "../../models/Book";
import { ResponsiveRadar } from "@nivo/radar";
import Resources from "../../middlewares/Resources";

interface BooksGenresProps {
  books: Book[];
  resources: Resources;
}

const BooksGenres: React.FC<BooksGenresProps> = ({ books, resources }) => {
  const buildData = () => {
    const data = [];
    for (const genre of resources.getGenres()) {
      if (genre === "Others") continue;
      data.push({
        taste: genre,
        genres: books.filter((book) =>
          (book.genres ? book.genres : []).includes(genre)
        ).length,
      });
    }
    return data;
  };

  const data = buildData();

  return (
    <>
      <Card
        className="d-inline-block sub-stat"
        style={{
          width: "100%",
        }}
      >
        <Card.Header>
          <h4>📚 Number of Books by Genre</h4>
        </Card.Header>
        <div style={{ height: "400px" }}>
          <ResponsiveRadar
            theme={{
              background: "#ffffff",
            }}
            data={data}
            keys={["genres"]}
            indexBy="taste"
            valueFormat=">-.2f"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            borderColor={{ from: "color" }}
            gridLabelOffset={15}
            dotSize={10}
            dotColor={{ theme: "background" }}
            dotBorderWidth={2}
            colors={{ scheme: "category10" }}
            blendMode="multiply"
            motionConfig="wobbly"
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: "#999",
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        <Card.Footer>
          <i>Number of books in each genre</i>
        </Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BooksGenres;
