import { DataToFile } from "./DataToFile";
import { DataToJson } from "./DataToJson";

export const saveData = async (
  userId: string,
  extension: Extensions
): Promise<string | null> => {
  let dataSaver: DataToFile;

  switch (extension) {
    case "json":
      dataSaver = new DataToJson(userId);
      break;
    default:
      dataSaver = new DataToJson(userId);
      break;
  }

  const fullPathFile = await dataSaver.save();

  return fullPathFile;
};
