let exampleModel;
const initExampleModel = async () => {
  try {
    if (exampleModel) return exampleModel;

    let exampleStructure = {
      example_id: {
        type: Number,
      },
      example_name: {
        type: String,
      },
    };

    let exampleScehma = await MONGOManager.createSchema(exampleStructure);
    await MONGOManager.createIndex(exampleScehma, { example_id: 1 }, "ExampleID");
    exampleModel = await MONGOManager.createModel("example", exampleScehma, "example");

    return exampleModel;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

module.exports = {
    initExampleModel,
};
