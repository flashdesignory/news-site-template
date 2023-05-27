const fs = require("fs").promises;

const rootDirectory = "./";
const sourceDirectory = "./src";
const targetDirectory = "./dist";

const htmlFile = "index.html";

const filesToMove = ["node_modules/news-site-css/dist/index.min.css"];
const foldersToMove = ["./assets"];

const copy = async (src, dest) => {
  await fs.copyFile(src, dest);
};

const build = async () => {
  // remove dist directory if it exists
  await fs.rm(targetDirectory, { recursive: true, force: true });

  // re-create the directory.
  await fs.mkdir(targetDirectory);

  // copy src folder
  await fs.cp(sourceDirectory, targetDirectory, { recursive: true }, (err) => {
    if (err) console.error(err);
  });

  // copy html file
  await fs.copyFile(
    `${rootDirectory}${htmlFile}`,
    `${targetDirectory}/${htmlFile}`
  );

  // copy files to move
  for (let i = 0; i < filesToMove.length; i++) {
    const fileName = filesToMove[i].split("/").pop();
    await copy(filesToMove[i], `${targetDirectory}/${fileName}`);
  }

  // copy folders to move
  for (let i = 0; i < foldersToMove.length; i++) {
    const folderName = foldersToMove[i].split("/").pop();
    await fs.cp(
      foldersToMove[i],
      `${targetDirectory}/${folderName}`,
      { recursive: true },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  // read html file
  let html = await fs.readFile(`${targetDirectory}/${htmlFile}`, "utf8");

  // remove base paths from files to move
  for (let i = 0; i < filesToMove.length; i++) {
    const fileName = filesToMove[i].split("/").pop();
    html = html.replace(filesToMove[i], fileName);
  }

  // remove basePath from source directory
  const basePath = `${sourceDirectory.split("/")[1]}/`;
  const re = new RegExp(basePath, "g");
  html = html.replace(re, "");

  // write html files
  await fs.writeFile(`${targetDirectory}/${htmlFile}`, html);

  console.log("done!!");
};

build();
