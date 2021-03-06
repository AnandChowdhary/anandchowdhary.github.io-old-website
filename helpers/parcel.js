const {
  readdir,
  copyFile,
  ensureDir,
  writeJson,
  createReadStream,
} = require("fs-extra");
const { join } = require("path");
const { fromStream } = require("ssri");

const copyParcelJs = async () => {
  const files = await readdir(join(__dirname, "..", "dist"));
  const jsFile = files.filter((f) => f.endsWith(".js"))[0];
  await ensureDir(join(__dirname, "..", "public", "assets", "scripts"));
  await copyFile(
    join(__dirname, "..", "dist", jsFile),
    join(__dirname, "..", "public", "assets", "scripts", jsFile)
  );
  try {
    await copyFile(
      join(__dirname, "..", "dist", `${jsFile}.map`),
      join(__dirname, "..", "public", "assets", "scripts", `${jsFile}.map`)
    );
  } catch (error) {}
  const integrityMap = await fromStream(
    createReadStream(
      join(__dirname, "..", "public", "assets", "scripts", jsFile)
    ),
    {
      algorithms: ["sha384"],
    }
  );
  await writeJson(
    join(__dirname, "..", "content", "_data", "jsFilePath.json"),
    {
      name: jsFile,
      integrity: integrityMap.toString(),
    }
  );
};

const copyParcelCss = async () => {
  const files = await readdir(join(__dirname, "..", "dist"));
  const cssFile = files.filter((f) => f.endsWith(".css"))[0];
  await ensureDir(join(__dirname, "..", "public", "assets", "styles"));
  await copyFile(
    join(__dirname, "..", "dist", cssFile),
    join(__dirname, "..", "public", "assets", "styles", cssFile)
  );
  try {
    await copyFile(
      join(__dirname, "..", "dist", `${cssFile}.map`),
      join(__dirname, "..", "public", "assets", "styles", `${cssFile}.map`)
    );
  } catch (error) {}
  const integrityMap = await fromStream(
    createReadStream(
      join(__dirname, "..", "public", "assets", "styles", cssFile)
    ),
    {
      algorithms: ["sha384"],
    }
  );
  await writeJson(
    join(__dirname, "..", "content", "_data", "cssFilePath.json"),
    {
      name: cssFile,
      integrity: integrityMap.toString(),
    }
  );
};

copyParcelJs()
  .then(() => console.log("Copied parcel JS"))
  .catch((error) => console.log(error));

copyParcelCss()
  .then(() => console.log("Copied parcel CSS"))
  .catch((error) => console.log(error));
