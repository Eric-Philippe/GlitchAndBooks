import React from "react";
import Card from "react-bootstrap/Card";

import { Book } from "../../models/Book";
import Resources from "../../middlewares/Resources";
import { ResponsivePie } from "@nivo/pie";

interface BookTypesProps {
  books: Book[];
  resources: Resources;
}

const BookTypes: React.FC<BookTypesProps> = ({ books, resources }) => {
  const buildData = () => {
    let data: { id: string; label: string; value: number }[] = [];
    const types = resources.getTypes();
    const booksByTypes = new Map<string, number>();

    types.forEach((type) => {
      booksByTypes.set(type, books.filter((b) => b.type === type).length);
    });

    booksByTypes.forEach((value, key) => {
      data.push({ id: key, label: key, value: value });
    });

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
          <h4>🔖 Book Types Breakdown</h4>
        </Card.Header>
        <div style={{ height: "420px" }}>
          <ResponsivePie
            data={data}
            margin={{ top: 50, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#FFF7"
            legends={[
              {
                anchor: "bottom-left",
                direction: "column",
                justify: false,
                translateX: -70,
                translateY: 75,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#FFF7",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
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
          <i>Number of books in each type</i>
        </Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BookTypes;
