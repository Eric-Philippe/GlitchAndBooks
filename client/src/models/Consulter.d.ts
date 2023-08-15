export interface Consulter {
  columns: Column[];
  rows: BookElement[][];
}

interface Column {
  name: string;
  size: ColumnSize;
  align: ColumnAlign;
}

type ColumnSize = "small" | "medium" | "large" | "xlarge";
type ColumnAlign = "left" | "center" | "right";
