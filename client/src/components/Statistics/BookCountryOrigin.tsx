import React from "react";
import Card from "react-bootstrap/Card";
import { Book } from "../../models/Book";

import { ResponsiveChoropleth } from "@nivo/geo";
import Resources from "../../middlewares/Resources";

const mapFeatures = require("../../utils/world_countries.json");

interface BookCountryOriginProps {
  books: Book[];
  resources: Resources;
}

const BookCountryOrigin: React.FC<BookCountryOriginProps> = ({
  books,
  resources,
}) => {
  const buildData = (books: Book[]): { id: string; value: number }[] => {
    let data: { id: string; value: number }[] = [];

    for (const country of resources.getCountriesWithCode()) {
      data.push({
        id: country.code,
        value: books.filter((book) => book.originCountry === country.country)
          .length,
      });
    }

    return data;
  };

  const data = buildData(books);
  // Get the maximum value of the data
  const max = Math.max(...data.map((d) => d.value));

  return (
    <>
      <Card className="">
        <Card.Header>
          <h4>🌎 Country of Origin</h4>
        </Card.Header>
        <div style={{ height: "420px" }}>
          <ResponsiveChoropleth
            theme={{
              background: "#E6E6E6FF",
            }}
            data={data}
            features={mapFeatures.features}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors="purples"
            domain={[0, max]}
            unknownColor="#7E8B94FF"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={120}
            projectionTranslation={[0.5, 0.65]}
            projectionRotation={[0, 0, 0]}
            enableGraticule={true}
            graticuleLineColor="#dddddd"
            borderWidth={0.5}
            borderColor="#152538"
            legends={[
              {
                anchor: "bottom-left",
                direction: "column",
                translateX: 10,
                translateY: -40,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",

                itemTextColor: "#202C33FF",
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000000FF",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
        <Card.Footer>Number of books per country of origin</Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BookCountryOrigin;
