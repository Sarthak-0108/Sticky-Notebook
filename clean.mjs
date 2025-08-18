import fs from "fs/promises";
import path from "path";

const basepath = "C:\\Users\\sarth\\OneDrive\\Documents\\Desktop\\Sticky-Note";

const files = await fs.readdir(basepath);

// console.log(files);

async function moveFile() {
  for (const file of files) {
    let extension;
    if (file.includes("jpg") || file.includes("png") || file.includes("webp")) {
      extension = file.split(".")[file.split.length - 1];
      console.log(file.split(".")[file.split.length - 1]);

      const sourceFile = file;
      const targetDir = `${basepath}\\${extension}`;
      const targetFile = path.join(targetDir, sourceFile);

      try {
        await fs.access(sourceFile);
        await fs.mkdir(targetDir, { recursive: true });
        await fs.rename(sourceFile, targetFile);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log("Source file does not exist");
        } else if (err.code === "EXDEV") {
          console.log("Cross-device move detected, using copy+delete fallback");
          await moveAcrossDevices(sourceFile, targetFile);
        } else {
          console.error("Error moving file:", err);
        }
      }
    }
  }
}

moveFile();
