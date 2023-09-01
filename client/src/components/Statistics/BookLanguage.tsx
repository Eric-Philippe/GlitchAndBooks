import React from "react";
import Card from "react-bootstrap/Card";

import { Book } from "../../models/Book";
import Resources from "../../middlewares/Resources";
import { ResponsiveBar } from "@nivo/bar";

interface BookLanguagesProps {
  books: Book[];
  resources: Resources;
}

const BookLanguages: React.FC<BookLanguagesProps> = ({ books, resources }) => {
  const buildData = () => {
    let data: { lang: string; languages: number }[] = [];
    for (const lang of resources.getLanguages()) {
      data.push({
        lang: lang,
        languages: books.filter((book) => book.lang === lang).length,
      });
    }

    data.sort((a, b) => a.languages - b.languages);

    // Remove languages with 0 books
    data = data.filter((lang) => lang.languages > 0);

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
          <h4>🌐 Languages</h4>
        </Card.Header>
        <div style={{ height: "260px" }}>
          <ResponsiveBar
            theme={{
              axis: {
                legend: {
                  text: {
                    fill: "#FFF7",
                  },
                },
                ticks: {
                  text: {
                    fill: "#FFF7",
                  },
                },
              },
            }}
            data={data}
            keys={["languages"]}
            indexBy="lang"
            layout="horizontal"
            margin={{ top: 0, right: 130, bottom: 50, left: 70 }}
            padding={0.3}
            borderRadius={3}
            borderWidth={2}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "paired" }}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Book Count",
              legendPosition: "middle",
              legendOffset: 32,
              tickValues: 7,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Languages",
              legendPosition: "middle",
              legendOffset: -60,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                itemTextColor: "#FFF7",
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
          />
        </div>

        <Card.Footer>
          <i>Number of books in each language</i>
        </Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BookLanguages;
