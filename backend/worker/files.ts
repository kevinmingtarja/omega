import * as fs from "fs";
import * as path from "path";

export const streamToString = (
  stream: NodeJS.ReadableStream
): Promise<string> => {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", (err) => reject(err));
  });
};

type RecursiveMap = { [key: string]: RecursiveMap };

export const getAllFiles = (dir: fs.PathLike, map: RecursiveMap) => {
  if (dir === "node_modules") {
    return {};
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return {};
  }

  files.forEach((file: string) => {
    const filePath = path.join(dir.toString(), file);

    if (fs.lstatSync(filePath).isDirectory()) {
      map[file] = getAllFiles(filePath, {});
    } else {
      map[file] = {};
    }
  });

  return map;
};

console.log(getAllFiles("./", {}));
