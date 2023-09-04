import { DataToCsv } from "./DataToCsv";
import { DataToFile } from "./DataToFile";
import { DataToJson } from "./DataToJson";
import { DataToPdf } from "./DataToPdf";
import { DataToXlsx } from "./DataToXlsx";
import { DataToXml } from "./DataToXml";

export const saveData = async (
  userId: string,
  extension: Extensions
): Promise<string | null> => {
  let dataSaver: DataToFile;

  switch (extension) {
    case "json":
      dataSaver = new DataToJson(userId);
      break;
    case "csv":
      dataSaver = new DataToCsv(userId);
      break;
    case "xlsx":
      dataSaver = new DataToXlsx(userId);
      break;
    case "pdf":
      dataSaver = new DataToPdf(userId);
      break;
    case "xml":
      dataSaver = new DataToXml(userId);
      break;
    default:
      dataSaver = new DataToJson(userId);
      break;
  }

  const fullPathFile = await dataSaver.save();

  return fullPathFile;
};
